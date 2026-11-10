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
            description: 'API Gateway URL for frontend'
        )
    }

    environment {
        DOCKER_BUILDKIT = '1'
        COMPOSE_PROJECT_NAME = 'microserviceproject'
    }

    stages {

        // ==========================================
        // 1. CHECKOUT
        // ==========================================

        stage('Checkout') {
            steps {
                checkout scm

                sh '''
                    echo "Checking out latest source code..."
                    git log -1 --oneline
                '''
            }
        }

        // ==========================================
        // 2. ENVIRONMENT VERIFICATION
        // ==========================================

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

                    echo "Checking project files..."

                    test -f docker-compose.yml
                    test -f FrontEnd/shoplite/Dockerfile

                    test -f Microservices/eureka-server/eureka-server/pom.xml
                    test -f Microservices/user-service/user-service/pom.xml

                    test -f Microservices/admin-service/pom.xml
                    test -f Microservices/api-gateway/pom.xml
                    test -f Microservices/cart-service/pom.xml
                    test -f Microservices/delivery-service/pom.xml
                    test -f Microservices/monitoring-server/Dockerfile
                    test -f Microservices/notification-service/pom.xml
                    test -f Microservices/order-service/pom.xml
                    test -f Microservices/product-service/pom.xml
                    test -f Microservices/ticket-service/pom.xml

                    echo "Checking Docker network..."
                    docker network inspect shoplite-network

                    echo "Checking BusyBox..."
                    docker image inspect busybox:1.36

                    echo "Validating Docker Compose..."
                    docker compose -p microserviceproject \
                        -f docker-compose.yml config --quiet

                    echo "Environment verification successful."
                '''
            }
        }

        // ==========================================
        // 3. MAVEN CLEAN INSTALL
        // ==========================================

        stage('Maven Clean Install') {
            steps {
                script {

                    def services = [
                        'Microservices/eureka-server/eureka-server',
                        'Microservices/user-service/user-service',
                        'Microservices/admin-service',
                        'Microservices/api-gateway',
                        'Microservices/cart-service',
                        'Microservices/delivery-service',
                        'Microservices/notification-service',
                        'Microservices/order-service',
                        'Microservices/product-service',
                        'Microservices/ticket-service'
                    ]

                    for (service in services) {

                        echo "========================================"
                        echo "Building Maven project: ${service}"
                        echo "========================================"

                        dir(service) {

                            sh '''
                                set -e

                                sh ./mvnw -B -ntp clean install -DskipTests
                            '''
                        }
                    }
                }
            }
        }

        // ==========================================
        // 4. BUILD DOCKER IMAGES
        // ==========================================

        stage('Build Docker Images') {
            steps {
                script {

                    def services = [
                        [
                            name: 'eureka-server',
                            context: 'Microservices/eureka-server/eureka-server'
                        ],
                        [
                            name: 'user-service',
                            context: 'Microservices/user-service/user-service'
                        ],
                        [
                            name: 'admin-service',
                            context: 'Microservices/admin-service'
                        ],
                        [
                            name: 'api-gateway',
                            context: 'Microservices/api-gateway'
                        ],
                        [
                            name: 'cart-service',
                            context: 'Microservices/cart-service'
                        ],
                        [
                            name: 'delivery-service',
                            context: 'Microservices/delivery-service'
                        ],
                        [
                            name: 'notification-service',
                            context: 'Microservices/notification-service'
                        ],
                        [
                            name: 'order-service',
                            context: 'Microservices/order-service'
                        ],
                        [
                            name: 'product-service',
                            context: 'Microservices/product-service'
                        ],
                        [
                            name: 'ticket-service',
                            context: 'Microservices/ticket-service'
                        ]
                    ]

                    for (service in services) {

                        echo "Building ${service.name} Docker image..."

                        sh """
                            set -e

                            docker build \
                                -f "${service.context}/Dockerfile" \
                                -t shoplite-${service.name}:latest \
                                -t shoplite-${service.name}:${BUILD_NUMBER} \
                                "${service.context}"
                        """
                    }

                    // Monitoring Server

                    echo "Building Monitoring Server..."

                    sh """
                        docker build \
                            -f Microservices/monitoring-server/Dockerfile \
                            -t shoplite-monitoring-server:latest \
                            -t shoplite-monitoring-server:${BUILD_NUMBER} \
                            Microservices/monitoring-server
                    """

                    // Frontend

                    echo "Building Frontend..."

                    sh """
                        docker build \
                            --build-arg VITE_API_URL="${VITE_API_URL}" \
                            -f FrontEnd/shoplite/Dockerfile \
                            -t shoplite-frontend:latest \
                            -t shoplite-frontend:${BUILD_NUMBER} \
                            FrontEnd/shoplite
                    """
                }
            }
        }

        // ==========================================
        // 5. IMAGE VERIFICATION
        // ==========================================

        stage('Docker Image Verification') {
            steps {
                sh '''
                    set -e

                    IMAGES="
                    shoplite-eureka-server
                    shoplite-user-service
                    shoplite-admin-service
                    shoplite-api-gateway
                    shoplite-cart-service
                    shoplite-delivery-service
                    shoplite-notification-service
                    shoplite-order-service
                    shoplite-product-service
                    shoplite-ticket-service
                    shoplite-monitoring-server
                    shoplite-frontend
                    "

                    for IMAGE in $IMAGES; do

                        echo "Verifying $IMAGE..."

                        docker image inspect "$IMAGE:latest" > /dev/null

                        echo "$IMAGE verified successfully."

                    done

                    echo "All 12 Docker images verified."
                '''
            }
        }

        // ==========================================
        // 6. DEPLOY LATEST CONTAINERS
        // ==========================================

        stage('Deploy Latest Containers') {
            steps {
                sh '''
                    set -e

                    echo "Deploying latest ShopLite containers..."

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

                    echo "Application containers recreated."
                '''
            }
        }

        // ==========================================
        // 7. VERIFY CONTAINER IMAGE VERSIONS
        // ==========================================

        stage('Verify Running Containers') {
            steps {
                sh '''
                    set -e

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

                    echo "All container image versions verified."
                '''
            }
        }

        // ==========================================
        // 8. APPLICATION HEALTH CHECKS
        // ==========================================

        stage('Application Health Checks') {
            steps {
                sh '''
                    set -e

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

        // ==========================================
        // 9. DEPLOYMENT SUMMARY
        // ==========================================

        stage('Deployment Summary') {
            steps {
                sh '''
                    echo "========================================"
                    echo "       SHOPLITE CI/CD PIPELINE"
                    echo "========================================"

                    echo "Build Number: ${BUILD_NUMBER}"

                    echo ""
                    echo "Running Containers:"

                    docker compose \
                        -p microserviceproject \
                        -f docker-compose.yml \
                        ps

                    echo ""
                    echo "Maven clean install completed."
                    echo "Docker images built successfully."
                    echo "Latest containers recreated."
                    echo "Image versions verified."
                    echo "Application health checks passed."

                    echo "SHOPLITE CI/CD PIPELINE SUCCESSFUL"

                    echo "========================================"
                '''
            }
        }
    }

    // ==========================================
    // POST ACTIONS
    // ==========================================

    post {

        success {
            echo 'SHOPLITE CI/CD PIPELINE SUCCESSFUL!'
            echo 'Latest application containers are deployed.'
        }

        failure {
            echo 'SHOPLITE CI/CD PIPELINE FAILED!'
            echo 'Check Jenkins console output for the failed stage.'
        }

        aborted {
            echo 'SHOPLITE CI/CD PIPELINE ABORTED.'
        }

        always {
            echo 'ShopLite pipeline execution completed.'
        }
    }
}