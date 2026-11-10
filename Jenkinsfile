pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 120, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15'))
    }

    parameters {
        string(
            name: 'VITE_API_URL',
            defaultValue: 'http://localhost:9090',
            description: 'API Gateway URL used by the frontend'
        )
    }

    environment {
        DOCKER_BUILDKIT = '1'
        COMPOSE_PROJECT_NAME = 'microserviceproject'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm

                echo 'Checked out the latest source code.'
                sh 'git log -1 --oneline'
            }
        }

        stage('Environment Verification') {
            steps {
                sh '''
                    set -e

                    echo "Checking Java..."
                    java -version

                    echo "Checking Docker..."
                    docker version

                    echo "Checking Docker Compose..."
                    docker compose version

                    echo "Checking required files..."
                    test -f docker-compose.yml
                    test -f frontend/Dockerfile

                    echo "Checking Docker network..."
                    docker network inspect shoplite-network

                    echo "Checking BusyBox image..."
                    docker image inspect busybox:1.36

                    echo "Validating Docker Compose configuration..."
                    docker compose -p microserviceproject \
                        -f docker-compose.yml config --quiet

                    echo "Environment verification completed."
                '''
            }
        }

        stage('Maven Clean Install') {
            steps {
                script {
                    def services = [
                        'eureka-server',
                        'user-service',
                        'product-service',
                        'cart-service',
                        'order-service',
                        'delivery-service',
                        'notification-service',
                        'ticket-service',
                        'admin-service',
                        'api-gateway'
                    ]

                    for (service in services) {
                        echo "Building ${service} using Maven..."

                        dir(service) {
                            sh '''
                                set -e

                                echo "Running Maven clean install..."
                                ./mvnw -B -ntp clean install -DskipTests
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def services = [
                        'eureka-server',
                        'user-service',
                        'product-service',
                        'cart-service',
                        'order-service',
                        'delivery-service',
                        'notification-service',
                        'ticket-service',
                        'admin-service',
                        'api-gateway'
                    ]

                    for (service in services) {
                        echo "Building Docker image for ${service}..."

                        sh """
                            set -e

                            docker build \
                                -t shoplite-${service}:latest \
                                -t shoplite-${service}:${BUILD_NUMBER} \
                                ./${service}
                        """
                    }

                    echo 'Building Monitoring Server image...'

                    sh """
                        docker build \
                            -t shoplite-monitoring-server:latest \
                            -t shoplite-monitoring-server:${BUILD_NUMBER} \
                            ./monitoring-server
                    """

                    echo 'Building Frontend image...'

                    sh """
                        docker build \
                            --build-arg VITE_API_URL="${VITE_API_URL}" \
                            -t shoplite-frontend:latest \
                            -t shoplite-frontend:${BUILD_NUMBER} \
                            ./frontend
                    """
                }
            }
        }

        stage('Docker Image Verification') {
            steps {
                sh '''
                    set -e

                    echo "Verifying all Docker images..."

                    IMAGES="
                    shoplite-eureka-server
                    shoplite-monitoring-server
                    shoplite-user-service
                    shoplite-product-service
                    shoplite-cart-service
                    shoplite-order-service
                    shoplite-delivery-service
                    shoplite-notification-service
                    shoplite-ticket-service
                    shoplite-admin-service
                    shoplite-api-gateway
                    shoplite-frontend
                    "

                    for IMAGE in $IMAGES; do
                        echo "Checking $IMAGE..."

                        docker image inspect "$IMAGE:latest" > /dev/null

                        echo "$IMAGE verified successfully."
                    done

                    echo "All 12 Docker images verified."
                '''
            }
        }

        stage('Deploy Latest Containers') {
            steps {
                sh '''
                    set -e

                    echo "Deploying updated ShopLite containers..."

                    docker compose \
                        -p microserviceproject \
                        -f docker-compose.yml \
                        up -d \
                        --no-deps \
                        --force-recreate \
                        --pull never \
                        eureka-server \
                        monitoring-server \
                        user-service \
                        product-service \
                        product-service-replica \
                        cart-service \
                        order-service \
                        delivery-service \
                        notification-service \
                        ticket-service \
                        admin-service \
                        api-gateway \
                        frontend

                    echo "All application containers recreated."
                '''
            }
        }

        stage('Verify Running Containers') {
            steps {
                sh '''
                    set -e

                    echo "Verifying running containers and image versions..."

                    verify_container() {
                        CONTAINER=$1
                        IMAGE=$2

                        STATUS=$(docker inspect \
                            --format='{{.State.Status}}' "$CONTAINER")

                        RUNNING_IMAGE=$(docker inspect \
                            --format='{{.Image}}' "$CONTAINER")

                        LATEST_IMAGE=$(docker image inspect \
                            --format='{{.Id}}' "$IMAGE:latest")

                        if [ "$STATUS" != "running" ]; then
                            echo "ERROR: $CONTAINER is not running."
                            exit 1
                        fi

                        if [ "$RUNNING_IMAGE" != "$LATEST_IMAGE" ]; then
                            echo "ERROR: $CONTAINER is using an old image."
                            exit 1
                        fi

                        echo "$CONTAINER is running with the latest image."
                    }

                    verify_container shoplite-eureka-server shoplite-eureka-server
                    verify_container shoplite-monitoring-server shoplite-monitoring-server
                    verify_container shoplite-user-service shoplite-user-service
                    verify_container shoplite-product-service shoplite-product-service
                    verify_container shoplite-product-service-replica shoplite-product-service
                    verify_container shoplite-cart-service shoplite-cart-service
                    verify_container shoplite-order-service shoplite-order-service
                    verify_container shoplite-delivery-service shoplite-delivery-service
                    verify_container shoplite-notification-service shoplite-notification-service
                    verify_container shoplite-ticket-service shoplite-ticket-service
                    verify_container shoplite-admin-service shoplite-admin-service
                    verify_container shoplite-api-gateway shoplite-api-gateway
                    verify_container shoplite-frontend-compose shoplite-frontend

                    echo "All containers are running with their latest images."
                '''
            }
        }

        stage('Application Health Checks') {
            steps {
                sh '''
                    set -e

                    echo "Starting application health checks..."

                    docker run --rm \
                        --network shoplite-network \
                        busybox:1.36 \
                        sh -c '
                            check() {
                                NAME=$1
                                URL=$2
                                COUNT=0

                                echo "Checking $NAME..."

                                until wget -q -T 5 -O /dev/null "$URL"; do
                                    COUNT=$((COUNT + 1))

                                    if [ "$COUNT" -ge 30 ]; then
                                        echo "ERROR: $NAME health check failed."
                                        exit 1
                                    fi

                                    echo "Waiting for $NAME..."
                                    sleep 5
                                done

                                echo "$NAME is responding."
                            }

                            check Eureka http://shoplite-eureka-server:8761/actuator/health
                            check Monitoring http://shoplite-monitoring-server:8090/actuator/health
                            check User-Service http://shoplite-user-service:8081/actuator/health
                            check Product-Service http://shoplite-product-service:8082/actuator/health
                            check Product-Replica http://shoplite-product-service-replica:8082/actuator/health
                            check Cart-Service http://shoplite-cart-service:8083/actuator/health
                            check Order-Service http://shoplite-order-service:8084/actuator/health
                            check Delivery-Service http://shoplite-delivery-service:8085/actuator/health
                            check Notification-Service http://shoplite-notification-service:8086/actuator/health
                            check Ticket-Service http://shoplite-ticket-service:8087/actuator/health
                            check Admin-Service http://shoplite-admin-service:8080/actuator/health
                            check API-Gateway http://shoplite-api-gateway:9090/actuator/health
                            check Frontend http://shoplite-frontend-compose/

                            echo "All application health checks passed."
                        '
                '''
            }
        }

        stage('Deployment Summary') {
            steps {
                sh '''
                    echo "========================================"
                    echo "       SHOPLITE CI/CD PIPELINE"
                    echo "========================================"

                    echo "Build Number: ${BUILD_NUMBER}"
                    echo "Git Branch: ${BRANCH_NAME}"

                    echo ""
                    echo "Running containers:"

                    docker compose \
                        -p microserviceproject \
                        -f docker-compose.yml \
                        ps

                    echo ""
                    echo "SHOPLITE DEPLOYMENT SUCCESSFUL"
                    echo "Maven clean install completed."
                    echo "Docker images built and verified."
                    echo "Latest containers recreated."
                    echo "Container image versions verified."
                    echo "Application health checks passed."

                    echo "========================================"
                '''
            }
        }
    }

    post {
        success {
            echo 'SHOPLITE CI/CD PIPELINE SUCCESSFUL!'
            echo 'Latest application containers are deployed.'
        }

        failure {
            echo 'SHOPLITE CI/CD PIPELINE FAILED!'
            echo 'Check the failed stage and Jenkins console output.'
        }

        aborted {
            echo 'SHOPLITE CI/CD PIPELINE ABORTED.'
        }

        always {
            echo 'ShopLite pipeline execution completed.'
        }
    }
}