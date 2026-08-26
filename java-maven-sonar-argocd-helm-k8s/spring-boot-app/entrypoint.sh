
   if [ -n $DOCKER_GID ]; then
       groupadd -g $DOCKER_GID docker-host || true
       usermod -aG docker-host springuser || true
   fi
   
