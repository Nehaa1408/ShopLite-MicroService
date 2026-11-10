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
            description: 'ShopLite API Gateway URL'
        )
    }

    environment {
        COMPOSE_PROJECT_NAME = 'microserviceproject'
        DOCKER_BUILDKIT = '1'
    }

    stages {

        // =========================================
        // 1. CHECKOUT
        // =========================================

        stage('Checkout') {
            steps {
                checkout scm

                sh '''
                    set -e

                    echo "Checking out latest source..."

                    git log -1 --oneline
                '''
            }
        }

        // =========================================
        // 2. PREPARE ENVIRONMENT
        // =========================================

        stage('Prepare Environment') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'shoplite-env-docker',
                        variable: 'SHOPLITE_ENV_FILE'
                    )
                ]) {
                    sh '''
                        set -eu

                        echo "Preparing Docker environment..."

                        test -f "$SHOPLITE_ENV_FILE"

                        cp "$SHOPLITE_ENV_FILE" .env.docker

                        chmod 600 .env.docker

                        test -s .env.docker

                        echo "Environment file prepared."
                    '''
                }
            }
        }

        // =========================================
        // 3. ENVIRONMENT VERIFICATION
        // =========================================

        stage('Environment Verification') {
            steps {
                sh '''
                    set -eu

                    echo "Checking Java..."
                    java -version

                    echo "Checking Docker..."
                    docker version

                    echo "Checking Docker Compose..."
                    docker compose version

                    echo "Checking Docker network..."
                    docker network inspect shoplite-network > /dev/null

                    echo "Checking required files..."

                    test -f docker-compose.yml
                    test -f .env.docker

                    test -f FrontEnd/shoplite/Dockerfile

                    test -f Microservices/eureka-server/eureka-server/pom.xml
                    test -f Microservices/eureka-server/eureka-server/Dockerfile

                    test -f Microservices/user-service/user-service/pom.xml
                    test -f Microservices/user-service/user-service/Dockerfile

                    test -f Microservices/admin-service/pom.xml
                    test -f Microservices/admin-service/Dockerfile

                    test -f Microservices/api-gateway/pom.xml
                    test -f Microservices/api-gateway/Dockerfile

                    test -f Microservices/cart-service/pom.xml
                    test -f Microservices/cart-service/Dockerfile

                    test -f Microservices/delivery-service/pom.xml
                    test -f Microservices/delivery-service/Dockerfile

                    test -f Microservices/monitoring-server/pom.xml
                    test -f Microservices/monitoring-server/mvnw
                    test -f Microservices/monitoring-server/Dockerfile

                    test -f Microservices/notification-service/pom.xml
                    test -f Microservices/notification-service/Dockerfile

                    test -f Microservices/order-service/pom.xml
                    test -f Microservices/order-service/Dockerfile

                    test -f Microservices/product-service/pom.xml
                    test -f Microservices/product-service/Dockerfile

                    test -f Microservices/ticket-service/pom.xml
                    test -f Microservices/ticket-service/Dockerfile

                    echo "Validating Docker Compose..."

                    docker compose \
                        -p microserviceproject \
                        -f docker-compose.yml \
                        config --quiet

                    echo "Environment verification successful."
                '''
            }
        }

        // =========================================
        // 4. MAVEN CLEAN INSTALL
        // =========================================

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

                        'Microservices/monitoring-server',

                        'Microservices/notification-service',

                        'Microservices/order-service',

                        'Microservices/product-service',

                        'Microservices/ticket-service'
                    ]

                    for (service in services) {

                        echo "========================================"
                        echo "MAVEN BUILD: ${service}"
                        echo "========================================"

                        dir(service) {

                            sh '''
                                set -eu

                                test -f pom.xml
                                test -f mvnw

                                sh ./mvnw \
                                    -B \
                                    -ntp \
                                    clean install \
                                    -DskipTests
                            '''
                        }
                    }

                    echo "All 11 Maven projects built successfully."
                }
            }
        }

        // =========================================
        // 5. VERIFY MAVEN JARS
        // =========================================

        stage('Verify Maven Artifacts') {
            steps {
                sh '''
                    set -eu

                    echo "Verifying generated JAR files..."

                    test -f Microservices/eureka-server/eureka-server/target/eureka-server-0.0.1-SNAPSHOT.jar

                    test -f Microservices/user-service/user-service/target/user-service-0.0.1-SNAPSHOT.jar

                    test -f Microservices/admin-service/target/admin-service-0.0.1-SNAPSHOT.jar

                    test -n "$(find Microservices/api-gateway/target -maxdepth 1 -name '*.jar' -type f)"

                    test -f Microservices/cart-service/target/cart-service-0.0.1-SNAPSHOT.jar

                    test -f Microservices/delivery-service/target/delivery-service-0.0.1-SNAPSHOT.jar

                    test -n "$(find Microservices/monitoring-server/target -maxdepth 1 -name '*.jar' -type f)"

                    test -f Microservices/notification-service/target/notification-service-0.0.1-SNAPSHOT.jar

                    test -f Microservices/order-service/target/order-service-0.0.1-SNAPSHOT.jar

                    test -f Microservices/product-service/target/product-service-0.0.1-SNAPSHOT.jar

                    test -f Microservices/ticket-service/target/ticket-service-0.0.1-SNAPSHOT.jar

                    echo "All Maven artifacts verified."
                '''
            }
        }

        // =========================================
        // 6. BUILD DOCKER IMAGES
        // =========================================

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
                            name: 'monitoring-server',
                            context: 'Microservices/monitoring-server'
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

                        echo "Building Docker image: ${service.name}"

                        sh """
                            set -eu

                            docker build \
                                -f "${service.context}/Dockerfile" \
                                -t shoplite-${service.name}:latest \
                                -t shoplite-${service.name}:${env.BUILD_NUMBER} \
                                "${service.context}"
                        """
                    }

                    // FRONTEND IMAGE

                    echo "Building Frontend Docker image..."

                    sh '''
                        set -eu

                        docker build \
                            --build-arg "VITE_API_URL=$VITE_API_URL" \
                            -f FrontEnd/shoplite/Dockerfile \
                            -t shoplite-frontend:latest \
                            -t "shoplite-frontend:$BUILD_NUMBER" \
                            FrontEnd/shoplite
                    '''

                    echo "All 12 Docker images built."
                }
            }
        }

        // =========================================
        // 7. DOCKER IMAGE VERIFICATION
        // =========================================

        stage('Docker Image Verification') {
            steps {
                sh '''
                    set -eu

                    IMAGES="
                    shoplite-eureka-server
                    shoplite-user-service
                    shoplite-admin-service
                    shoplite-api-gateway
                    shoplite-cart-service
                    shoplite-delivery-service
                    shoplite-monitoring-server
                    shoplite-notification-service
                    shoplite-order-service
                    shoplite-product-service
                    shoplite-ticket-service
                    shoplite-frontend
                    "

                    echo "Verifying Docker images..."

                    for IMAGE in $IMAGES
                    do
                        docker image inspect "$IMAGE:latest" > /dev/null

                        docker image inspect "$IMAGE:$BUILD_NUMBER" > /dev/null

                        echo "$IMAGE verified."
                    done

                    echo "All 12 images verified successfully."
                '''
            }
        }

        // =========================================
        // 8. DEPLOY LATEST CONTAINERS
        // =========================================

        stage('Deploy Latest Containers') {
            steps {
                sh '''
                    set -eu

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

                    echo "Deployment command completed."
                '''
            }
        }

        // =========================================
        // 9. VERIFY RUNNING CONTAINERS
        // =========================================

        stage('Verify Running Containers') {
            steps {
                sh '''
                    set -eu

                    verify_container() {

                        CONTAINER="$1"
                        IMAGE="$2"

                        echo "Verifying $CONTAINER..."

                        STATUS=$(docker inspect \
                            --format='{{.State.Status}}' "$CONTAINER")

                        RUNNING_IMAGE=$(docker inspect \
                            --format='{{.Image}}' "$CONTAINER")

                        LATEST_IMAGE=$(docker image inspect \
                            --format='{{.Id}}' "$IMAGE:latest")

                        if [ "$STATUS" != "running" ]; then

                            echo "ERROR: $CONTAINER is not running."

                            docker logs --tail 50 "$CONTAINER" || true

                            exit 1
                        fi

                        if [ "$RUNNING_IMAGE" != "$LATEST_IMAGE" ]; then

                            echo "ERROR: $CONTAINER is using an unexpected image."

                            exit 1
                        fi

                        echo "$CONTAINER verified successfully."
                    }

                    verify_container shoplite-eureka-server shoplite-eureka-server

                    verify_container shoplite-user-service shoplite-user-service

                    verify_container shoplite-admin-service shoplite-admin-service

                    verify_container shoplite-api-gateway shoplite-api-gateway

                    verify_container shoplite-cart-service shoplite-cart-service

                    verify_container shoplite-delivery-service shoplite-delivery-service

                    verify_container shoplite-monitoring-server shoplite-monitoring-server

                    verify_container shoplite-notification-service shoplite-notification-service

                    verify_container shoplite-order-service shoplite-order-service

                    verify_container shoplite-product-service shoplite-product-service

                    verify_container shoplite-product-service-replica shoplite-product-service

                    verify_container shoplite-ticket-service shoplite-ticket-service

                    verify_container shoplite-frontend-compose shoplite-frontend

                    echo "All 13 containers verified successfully."
                '''
            }
        }

        // =========================================
        // 10. APPLICATION PORT READINESS
        // =========================================

        stage('Application Port Readiness') {
            steps {
                sh '''
                    set -eu

                    echo "Checking application ports..."

                    docker run --rm \
                        --network shoplite-network \
                        busybox:1.36 \
                        sh -c '

                            wait_for_port() {

                                HOST="$1"
                                PORT="$2"
                                NAME="$3"

                                ATTEMPT=1

                                echo "Waiting for $NAME..."

                                while [ "$ATTEMPT" -le 60 ]
                                do

                                    if nc -w 2 "$HOST" "$PORT" </dev/null >/dev/null 2>&1
                                    then
                                        echo "$NAME is accepting connections."
                                        return 0
                                    fi

                                    ATTEMPT=$((ATTEMPT + 1))

                                    sleep 5
                                done

                                echo "ERROR: $NAME did not become ready."

                                return 1
                            }

                            wait_for_port shoplite-eureka-server 8761 Eureka

                            wait_for_port shoplite-monitoring-server 8090 Monitoring

                            wait_for_port shoplite-user-service 8081 User-Service

                            wait_for_port shoplite-admin-service 8080 Admin-Service

                            wait_for_port shoplite-api-gateway 9090 API-Gateway

                            wait_for_port shoplite-cart-service 8083 Cart-Service

                            wait_for_port shoplite-delivery-service 8085 Delivery-Service

                            wait_for_port shoplite-notification-service 8086 Notification-Service

                            wait_for_port shoplite-order-service 8084 Order-Service

                            wait_for_port shoplite-product-service 8082 Product-Service

                            wait_for_port shoplite-product-service-replica 8082 Product-Replica

                            wait_for_port shoplite-ticket-service 8087 Ticket-Service

                            wait_for_port shoplite-frontend-compose 80 Frontend

                            echo "All application ports are accepting connections."
                        '
                '''
            }
        }

        // =========================================
        // 11. DEPLOYMENT SUMMARY
        // =========================================

        stage('Deployment Summary') {
            steps {
                sh '''
                    set -eu

                    echo "========================================"
                    echo "          SHOPLITE CI/CD"
                    echo "========================================"

                    echo "Build Number: $BUILD_NUMBER"

                    echo ""
                    echo "Running containers:"

                    docker compose \
                        -p microserviceproject \
                        -f docker-compose.yml \
                        ps

                    echo ""
                    echo "Maven clean install completed."
                    echo "12 Docker images built and verified."
                    echo "13 application containers recreated."
                    echo "Container image IDs verified."
                    echo "Application ports verified."

                    echo ""
                    echo "SHOPLITE CI/CD SUCCESSFUL"

                    echo "========================================"
                '''
            }
        }
    }

    // =========================================
    // POST BUILD ACTIONS
    // =========================================

    post {

        success {
            echo 'SHOPLITE CI/CD PIPELINE SUCCESSFUL!'
            echo 'Latest application containers deployed.'
        }

        failure {
            echo 'SHOPLITE CI/CD PIPELINE FAILED!'
            echo 'Check the failed stage in Jenkins Console Output.'
        }

        aborted {
            echo 'SHOPLITE CI/CD PIPELINE ABORTED.'
        }

        always {

            sh '''
                rm -f .env.docker || true
            '''

            echo 'ShopLite pipeline execution completed.'
        }
    }
}