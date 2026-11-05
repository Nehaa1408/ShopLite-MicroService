pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 90, unit: 'MINUTES')
        buildDiscarder(logRotator(
            numToKeepStr: '15',
            artifactNumToKeepStr: '5'
        ))
    }

    parameters {
        string(
            name: 'VITE_API_URL',
            defaultValue: 'http://localhost:9090',
            description: 'API Gateway URL used by the frontend production build'
        )
    }

    environment {
        DOCKER_BUILDKIT = '1'
    }

    stages {

        // --------------------------------------------------
        // 1. CHECKOUT
        // --------------------------------------------------

        stage('Checkout') {
            steps {
                checkout scm

                script {
                    echo "Building ShopLite"
                    echo "Branch: ${env.BRANCH_NAME ?: 'SCM configured branch'}"
                    echo "Commit: ${env.GIT_COMMIT ?: 'Not available'}"
                }
            }
        }

        // --------------------------------------------------
        // 2. ENVIRONMENT VALIDATION
        // --------------------------------------------------

        stage('Environment Check') {
            steps {
                sh '''
                    set -eu

                    echo "Checking Java..."
                    java -version

                    echo "Checking Docker CLI..."
                    docker --version

                    echo "Checking Docker Engine..."
                    docker info

                    echo "Checking required project files..."

                    test -f docker-compose.yml
                    test -f FrontEnd/shoplite/package.json

                    echo "Environment validation successful."
                '''
            }
        }

        // --------------------------------------------------
        // 3. BACKEND BUILD AND TEST
        // --------------------------------------------------

        stage('Backend Build and Test') {
            steps {
                script {

                    def services = [
                        [
                            name: 'Eureka Server',
                            path: 'Microservices/eureka-server/eureka-server'
                        ],
                        [
                            name: 'User Service',
                            path: 'Microservices/user-service/user-service'
                        ],
                        [
                            name: 'Product Service',
                            path: 'Microservices/product-service'
                        ],
                        [
                            name: 'Cart Service',
                            path: 'Microservices/cart-service'
                        ],
                        [
                            name: 'Order Service',
                            path: 'Microservices/order-service'
                        ],
                        [
                            name: 'Delivery Service',
                            path: 'Microservices/delivery-service'
                        ],
                        [
                            name: 'Notification Service',
                            path: 'Microservices/notification-service'
                        ],
                        [
                            name: 'Admin Service',
                            path: 'Microservices/admin-service'
                        ],
                        [
                            name: 'Ticket Service',
                            path: 'Microservices/ticket-service'
                        ],
                        [
                            name: 'API Gateway',
                            path: 'Microservices/api-gateway'
                        ]
                    ]

                    for (service in services) {

                        echo "Building and testing ${service.name}"

                        dir(service.path) {

                            sh '''
                                set -eu

                                chmod +x mvnw

                                ./mvnw \
                                    -B \
                                    -ntp \
                                    clean verify
                            '''
                        }
                    }
                }
            }

            post {
                always {
                    junit(
                        testResults: 'Microservices/**/target/surefire-reports/*.xml',
                        allowEmptyResults: true
                    )
                }
            }
        }

        // --------------------------------------------------
        // 4. MONITORING SERVER
        // --------------------------------------------------

        stage('Monitoring Server Build') {
            steps {
                dir('Microservices/monitoring-server') {
                    sh '''
                        set -eu

                        docker build \
                            -t shoplite-monitoring-server:latest \
                            -t shoplite-monitoring-server:${BUILD_NUMBER} \
                            .
                    '''
                }
            }
        }

        // --------------------------------------------------
        // 5. BACKEND DOCKER IMAGE BUILD
        // --------------------------------------------------

        stage('Backend Docker Images') {
            steps {
                script {

                    def dockerServices = [
                        [
                            name: 'Eureka Server',
                            path: 'Microservices/eureka-server/eureka-server',
                            image: 'shoplite-eureka-server'
                        ],
                        [
                            name: 'User Service',
                            path: 'Microservices/user-service/user-service',
                            image: 'shoplite-user-service'
                        ],
                        [
                            name: 'Product Service',
                            path: 'Microservices/product-service',
                            image: 'shoplite-product-service'
                        ],
                        [
                            name: 'Cart Service',
                            path: 'Microservices/cart-service',
                            image: 'shoplite-cart-service'
                        ],
                        [
                            name: 'Order Service',
                            path: 'Microservices/order-service',
                            image: 'shoplite-order-service'
                        ],
                        [
                            name: 'Delivery Service',
                            path: 'Microservices/delivery-service',
                            image: 'shoplite-delivery-service'
                        ],
                        [
                            name: 'Notification Service',
                            path: 'Microservices/notification-service',
                            image: 'shoplite-notification-service'
                        ],
                        [
                            name: 'Admin Service',
                            path: 'Microservices/admin-service',
                            image: 'shoplite-admin-service'
                        ],
                        [
                            name: 'Ticket Service',
                            path: 'Microservices/ticket-service',
                            image: 'shoplite-ticket-service'
                        ],
                        [
                            name: 'API Gateway',
                            path: 'Microservices/api-gateway',
                            image: 'shoplite-api-gateway'
                        ]
                    ]

                    for (service in dockerServices) {

                        echo "Building Docker image for ${service.name}"

                        sh """
                            docker build \
                                -t ${service.image}:latest \
                                -t ${service.image}:${env.BUILD_NUMBER} \
                                '${service.path}'
                        """
                    }
                }
            }
        }

        // --------------------------------------------------
        // 6. FRONTEND DOCKER IMAGE
        // --------------------------------------------------

        stage('Frontend Docker Build') {
            steps {

                script {
                    if (!params.VITE_API_URL?.trim()) {
                        error('VITE_API_URL cannot be empty.')
                    }
                }

                dir('FrontEnd/shoplite') {

                    sh '''
                        set -eu

                        docker build \
                            --build-arg "VITE_API_URL=$VITE_API_URL" \
                            -t shoplite-frontend:latest \
                            -t shoplite-frontend:${BUILD_NUMBER} \
                            .
                    '''
                }
            }
        }

        // --------------------------------------------------
        // 7. IMAGE VERIFICATION
        // --------------------------------------------------

        stage('Docker Image Verification') {
            steps {
                sh '''
                    set -eu

                    images="
                    shoplite-eureka-server
                    shoplite-monitoring-server
                    shoplite-user-service
                    shoplite-product-service
                    shoplite-cart-service
                    shoplite-order-service
                    shoplite-delivery-service
                    shoplite-notification-service
                    shoplite-admin-service
                    shoplite-ticket-service
                    shoplite-api-gateway
                    shoplite-frontend
                    "

                    for image in $images
                    do
                        echo "Verifying $image"

                        docker image inspect "$image:latest" > /dev/null

                        echo "$image verified successfully."
                    done

                    echo "All 12 application images verified."
                '''
            }
        }
    }

    // ------------------------------------------------------
    // POST BUILD ACTIONS
    // ------------------------------------------------------

    post {

        success {
            echo '''
            ==========================================
                  SHOPLITE CI PIPELINE SUCCESS
            ==========================================
            All backend builds and tests completed.
            All Docker images were created and verified.
            ==========================================
            '''
        }

        failure {
            echo '''
            ==========================================
                  SHOPLITE CI PIPELINE FAILED
            ==========================================
            Check the failed stage and console output.
            ==========================================
            '''
        }

        aborted {
            echo 'ShopLite CI pipeline was aborted.'
        }

        always {
            echo "Pipeline execution finished: ${currentBuild.currentResult}"
        }
    }
}