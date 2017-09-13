node('vetsgov-general-purpose') {
  stage('Sleep') {
    sleep 100

  }

  stage('Debug') {
    steps {
      script {
          echo "Branch: ${env.BRANCH_NAME}"

          if ( currentBuild.nextBuild ) {
            echo "Next build: ${currentBuild.nextBuild.getId()}"
          }
      }
    }
  }
}
