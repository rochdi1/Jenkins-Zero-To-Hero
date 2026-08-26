# Spring Boot based Java web application
 
This is a simple Sprint Boot based Java application that can be built using Maven. Sprint Boot dependencies are handled using the pom.xml 
at the root directory of the repository.

This is a MVC architecture based application where controller returns a page with title and message attributes to the view.

## Execute the application locally and access it using your browser

Checkout the repo and move to the directory

```
git clone https://github.com/rochdi1/Jenkins-Zero-To-Hero/java-maven-sonar-argocd-helm-k8s/sprint-boot-app
cd java-maven-sonar-argocd-helm-k8s/sprint-boot-app
```

Execute the Maven targets to generate the artifacts

```
mvn clean package
```

The above maven target stroes the artifacts to the `target` directory. You can either execute the artifact on your local machine
(or) run it as a Docker container.

** Note: To avoid issues with local setup, Java versions and other dependencies, I would recommend the docker way. **


### Execute locally (Java 11 needed) and access the application on http://localhost:8080

```
java -jar target/spring-boot-web.jar
```

### The Docker way

Build the Docker Image

```
docker build -t ultimate-cicd-pipeline:v1 .
```

```
docker run -d -p 8010:8080 -t ultimate-cicd-pipeline:v1
```

Hurray !! Access the application on `http://<ip-address>:8010`


## Next Steps

### Configure a Sonar Server locally

```
System Requirements
Java 17+ (Oracle JDK, OpenJDK, or AdoptOpenJDK)
Hardware Recommendations:
   Minimum 2 GB RAM
   2 CPU cores
sudo apt update && sudo apt install unzip -y
adduser sonarqube
wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-10.4.1.88267.zip
unzip *
chown -R sonarqube:sonarqube /opt/sonarqube
chmod -R 775 /opt/sonarqube
cd /opt/sonarqube/bin/linux-x86-64
./sonar.sh start
```

Hurray !! Now you can access the `SonarQube Server` on `http://<ip-address>:9000` 

docker login wenn nicht funktionniert
nano ~/.docker/config.json

``` Entferne die Zeile "credsStore": "pass" (oder "desktop"). 

Die Datei sollte danach minimalistisch so aussehen:

```json

{
  "auths": {}
}
```


```
docker run -d --name sonarqube -p 9000:9000 sonarqube:10.4.1-community
```

```
docker exec -it sonarqube bash
```

```
apt update
adduser sonarqube

exit
docker restart sonarqube

docker rm -f sonarqube
```

Befehle zum Starten:Host-System vorbereiten (Zwingend erforderlich für Elasticsearch in SonarQube):
```bash
sudo sysctl -w vm.max_map_count=524288
```

``` Container starten:
```bash
docker compose up -d
```

Nein, du darfst diesen Befehl nicht im Docker-Container ausführen. 

Du musst ihn direkt auf deinem Linux-Host-System (also auf deinem Server oder PC) eingeben.

Warum auf dem Host-System?

sysctl ändert Einstellungen des Linux-Kernels.

Docker-Container teilen sich den Kernel des Host-Systems.Ein normaler Container hat aus Sicherheitsgründen keine Rechte, Kernel-Parameter zu ändern.

Wenn du es im Container versuchst, erhältst du eine Fehlermeldung wie sysctl: setting key: Read-only file system.
So machst du es richtig:

Öffne dein normales Terminal auf dem Server (gehe nicht in den Container).

Führe den Befehl direkt aus:

```bash
sudo sysctl -w vm.max_map_count=524288
``` 

Mache die Änderung dauerhaft (sonst ist sie nach einem Server-Neustart weg):

```bash
echo "vm.max_map_count=524288" | sudo tee -a /etc/sysctl.conf
```

 Danach kannst du die Container wie gewohnt starten:

```bash
docker compose up -d
```


process:

Entwickler:

1- Entwicklung (code Anpassung)

2- docker rmi my-spring-boot-app-image

3- docker build -t my-spring-boot-app-image .

4- docker tag my-spring-boot-app-image rochdi1/my-spring-boot-app-image:v5.0

5- docker login

6- docker push rochdi1/my-spring-boot-app-image:v5.0

Kunde:

1- docker pull rochdi1/my-spring-boot-app-image:v5.0

2- docker run rochdi1/my-spring-boot-app-image:v5.0


Wenn du die Docker-Gruppen-ID (`DOCKER_GID`) dynamisch an deinen Spring-Boot-App-Container übergeben musst – typischerweise weil deine Spring-Boot-Anwendung innerhalb des Containers den Docker-Socket (`/var/run/docker.sock`) nutzen möchte (Docker-in-Docker / Sidecar) –, kannst du das nicht direkt hartcodiert in ein statisches YAML-File schreiben.

Hier sind die zwei besten Wege, um das elegant in deinem Setup zu lösen:

### Methode 1: Über eine `.env`-Datei (Empfohlen für Docker Compose)

Docker Compose liest automatisch eine Datei namens `.env` im selben Ordner aus.

1. **Erstelle eine `.env` Datei in deinem Projektordner:**
   ```bash
   echo "DOCKER_GID=\$(getent group docker | cut -d: -f3)" > .env
   ```
   *(Dieser Befehl schreibt die korrekte ID deines Linux-Hosts direkt in die Datei).*

2. **Binde die Variable in deiner `docker-compose.yml` ein:**
   Füge bei deiner Spring-Boot-App (nicht bei SonarQube) die Umgebungsvariable und den Socket-Volume hinzu:

   ```yaml
   services:
     spring-boot-app:
       image: my-spring-boot-app-image:latest
       environment:
         - DOCKER_GID=\${DOCKER_GID}
       volumes:
         - /var/run/docker.sock:/var/run/docker.sock
       ports:
         - "8080:8080"
       depends_on:
         - sonarqube

     sonarqube:
       image: sonarqube:10.4.1-community
       # ... restliche SonarQube Konfiguration von vorhin ...
   ```

---

### Methode 2: Direkt per Shell beim Starten übergeben

Wenn du keine `.env`-Datei anlegen möchtest, kannst du die Variable beim Aufruf von `docker compose` direkt aus der Shell injizieren:

```bash
DOCKER_GID=\$(getent group docker | cut -d: -f3) docker compose up -d
```

Docker Compose ersetzt dann `${DOCKER_GID}` in der YAML-Datei mit dem Live-Wert aus deinem Terminal.

---

### 💡 Warum braucht deine Spring Boot App das? (Wichtiger Sicherheitshinweis)

Falls deine Spring-Boot-App mit dieser ID die Berechtigung erhalten soll, Container zu steuern (z.B. um Testcontainers für Integrationstests auszuführen oder Sonar-Scans zu triggern), stelle sicher, dass im Dockerfile deiner Spring-Boot-App auch ein Skript existiert, das diese `DOCKER_GID` nutzt, um die Gruppen-ID im Container anzupassen.

Ein typischer Eintrag im `entrypoint.sh` der Spring-Boot-App sieht so aus:

```bash
if [ -n "\$DOCKER_GID" ]; then
  groupadd -g "\$DOCKER_GID" docker-host || true
  usermod -aG docker-host springuser || true
fi
```


   ```bash
   echo """
   if [ -n "\$DOCKER_GID" ]; then
       groupadd -g "\$DOCKER_GID" docker-host || true
       usermod -aG docker-host springuser || true
   fi
   """ > entrypoint.sh
   ```



------------------
Für dein lokales DevOps-Testing benötigst du für den Anfang kein Jenkins und kein Kubernetes.
 Das wäre für eine lokale Umgebung viel zu schwerfällig (Overengineering).Der einfachste und effizienteste Weg für Entwickler ist die Direkt-Verbindung über Docker.
 
 Direkt-Antwort: Welcher Weg ist der beste?
 
 Verbinde deine Spring Boot App direkt mit dem SonarQube-Container über dein lokales Build-Tool (Maven oder Gradle). Sobald der Test erfolgreich ist, baust du das Docker-Image und pushst es in die Registry (Docker Hub).
 
  Jenkins und Kubernetes machen erst Sinn, wenn du ein ganzes Team koordinierst oder in eine echte Cloud-Infrastruktur (Staging/Produktion) gehst.Hier sind die beiden Wege im Vergleich, dargestellt als Prozess-Diagramme:
  
  **Option 1:**
   Der empfohlene, schlanke Weg (Lokal)Dieser Weg ist extrem schnell, da dein lokaler Code direkt mit dem Docker-SonarQube kommuniziert.
   
   ```
   [ Dein Java Code ] 
       │
       ▼ (Lokaler Build & Scan)
  ./mvnw sonar:sonar  ───► [ SonarQube Container ] (Prüft Code-Qualität)
       │
       ▼ (Wenn Code-Qualität OK)
  docker build 
       │
       ▼
[ Docker Hub / Registry ]
```

**Option 2:**

 Der vollständige CI/CD-Weg (Für Teams & Produktion)Diesen Weg wählst du erst, wenn du Automatisierung für ein Git-Repository (z. B. GitHub/GitLab) einrichtest.
 
 ```
 [ Git Push / Commit ]
       │
       ▼ (Triggert Pipeline)
   [ Jenkins ] ─── (1. Baut & Testet Java Code)
       │
       ├───► [ SonarQube Container ] (2. Qualitätstor prüfen)
       │
       ├───► docker build & push ───► [ Docker Hub ] (3. Image speichern)
       │
       ▼ (4. Automatisches Deployment)
 [ Kubernetes ]
 ```


So setzt du Option 1 lokal in 3 Schritten um:

* SonarQube starten: Starte deinen SonarQube-Container wie zuvor besprochen auf Port 9000.

* Scan ausführen: Du musst die Spring Boot App nicht im Container laufen lassen, um sie zu prüfen. 

* Führe einfach folgenden Befehl in deinem Projektordner auf dem Host-System aus:

Mit Maven:

```bash
./mvnw clean verify sonar:sonar -Dsonar.login=DEIN_SONAR_TOKEN -Dsonar.host.url=http://localhost:9000
``` 
Mit Gradle:
```bash
./gradlew sonar -Dsonar.login=DEIN_SONAR_TOKEN -Dsonar.host.url=http://localhost:9000
``` 
Image pushen: Wenn SonarQube grünes Licht gibt, baust du dein Image und schiebst es hoch:

```bash
docker build -t rochdi1/spring-app:latest .

docker push rochdi1/spring-app:latest
```
Nutzt dein Spring Boot Projekt Maven oder Gradle? Ich kann dir die genauen Zeilen zeigen, die du in deine pom.xml oder build.gradle einfügen musst, damit der Sonar-Scan reibungslos funktioniert.



Schritt 1: 
Erstelle ein neues, leeres Repository auf GitHubLogge dich auf github.com in deinen Account ein.Klicke oben rechts auf das + Symbol und wähle New repository.Gib dem Repository einen Namen (z.B. spring-boot-devops-test).Wichtig: Wähle Public oder Private, aber füge KEINE README, .gitignore oder Lizenz hinzu. Das Repository muss komplett leer sein!Klicke auf Create repository.Kopiere die neue Repository-URL (sieht aus wie https://github.com).

Schritt 2: 

Die Verbindung im lokalen Terminal ändernGehe zurück in dein Terminal in deinen Projektordner. Aktuell zeigt Git noch auf den alten Besitzer (origin). Das ändern wir jetzt.Prüfe die aktuelle (alte) Verbindung

```bash
git remote -v
```
``` Benenne die alte Verbindung um (Sicherheitsnetz):

```bash
git remote rename origin upstream
```
``` Füge dein eigenes neues GitHub-Repository als Hauptziel (origin) hinzu:

```bash
git remote add origin https://github.com/rochdi1/Jenkins-Zero-To-Hero.git 
```

(Ersetze die URL mit deiner kopierten URL aus Schritt 1!)Schritt 3: Code in dein eigenes GitHub pushenJetzt lädst du den gesamten Code inklusive deiner lokalen Anpassungen (wie der korrigierten SonarQube-Datei) in deinen Account hoch:

```bash
git push -u origin --all
```
Falls das Projekt auch Git-Tags (Versionsmarkierungen) enthält, kannst du diese optional mit hochladen:

```bash
git push origin --tags
```

Wenn du ab jetzt git push ausführst, landen alle deine Änderungen automatisch in deinem eigenen GitHub-Profil.