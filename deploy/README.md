# Remote Deployment

## Preamble
This example, we will be using the cloud provider Digital Ocean to demonstrate the deployment process for this comprehensive solution.

This solution includes the use of JATOS for the serving and collection of psychological research data, and the use of filebrowser to simplify the process of uploading JATOS assets to their relevant experiment folder.

Filebrowser is a heavy lifter in this deployment as without it, the user would be required to use the command line to securely copy files from their local machine (their computer) to the remote machine (Digital Ocean Droplet).

A redundant set of instructions will still be supplied in the event that the Filebrowser service becomes unreachable while the JATOS service is still available. This maintains Availability of service until a fix can be applied.

#### Assumptions
- You have a domain name and ability to configure DNS records.

## Services & Tech Used
#### [Digital Ocean](https://www.digitalocean.com/)
A cloud provider used to deploy and host all of the following technologies.

#### [Docker Compose](https://www.docker.com/)
A program that allows us to start a number of services all at once inside a self contained container.

*License:* [Apache-2.0](https://github.com/docker/compose?tab=Apache-2.0-1-ov-file#readme)

#### [Nginx Proxy Manager](https://nginxproxymanager.com/)
A program that handles and routes all incoming web requests to the correct resources.

*License:* [MIT](https://github.com/NginxProxyManager/nginx-proxy-manager?tab=MIT-1-ov-file#readme)

#### [JATOS](https://www.jatos.org/)
A self served hosting solution to run experiments such as jsPsych.

*License:* [Apache-2.0](https://github.com/JATOS/JATOS?tab=Apache-2.0-1-ov-file#readme)

#### [Filebrowser](https://filebrowser.org/)
A self hosted file manager that provides a simple and easy to use graphical interface.

*License:* [Apache-2.0](https://github.com/filebrowser/filebrowser?tab=Apache-2.0-1-ov-file#readme)

#### [jsPsych](https://www.jspsych.org/v7/)
A JavaScript framework for creating behavioral experiments that run in a web browser.

*License:* [MIT](https://www.jspsych.org/v7/about/license/)

## Set up an account
To start, we will need to register and set up an account on [Digital Ocean](https://www.digitalocean.com/).

- You will have the option to sign up using email credentials or something like your Google or GitHub account.
- During registration, you will need to set up a team. Name this team what ever you want, it is just a central area for you to manage your cloud deployment.
- You will be asked to enter some billing information. Don't worry, you shouldn't be charged anything at the moment.

## Deploy a Droplet
A droplet is one of the simplest and easiest ways to deploy a virtual machine (VM). Think of a VM as a computer, except it is on the internet. We can adjust the specifications of this computer, i.e., how much storage, memory, or CPU it has. Obviously the more you give it, the more it ends up costing.

For our purposes, the cheapest instance should be fine to get an initial deployment. Should you start having any issues, like slow responses or crashing, this may be a signal that you need to increase the resources allocated to your VM. This is out of scope for the current set of instructions and we would recommend you seek information from the Digital Ocean [documentation](https://docs.digitalocean.com/) or their [support team](https://docs.digitalocean.com/support/).

#### Deployment Instructions
Note: these instructions are correct as of the time of writing, however this process may be subject to change. This is the official Digital Ocean [instructions](https://docs.digitalocean.com/products/droplets/how-to/create/) should you need to look in to them.

1.  From your main dashboard, click "Create" and select "Droplets" from the choices.
**image**

2. Choose the region closest to you. In this case, Australia only has one server, Sydney.
**image**

3. We need to choose an image which is essentially the operating system and any dependencies required to start your VM. For this purpose, we want to choose a VM with Linux and Docker installed.
- Select "Marketplace"
- Select "Docker preinstalled Ubuntu" (if you can't find it, search for Docker in the search bar).
**image**

4. Now we have to provision the resources for our VM.
- Choose "Regular with SSD"
- Scroll the options all the way to the start and pick the first (lowest cost) option. It should be $6USD per month.

5. Set your password
- This is option slightly less secure than using SSH keys, although the risk is minimal if you ensure good cybersecurity practices.
- If you're comfortable with SSH keys, feel free to set them up. They are out of scope for this exercise.
**image**

6. Click the "Advanced Options" button and tick the "Add Initialization scripts" option.
**image**

7. In the textarea that appears, paste in the entire contents of the `deploy.sh` file.
- This script will:
  - Download `ufw` (Uncomplicated Firewall)
  - Allow all outgoing traffic
  - Block all incoming traffic except on port 80 and 443 (HTTP and HTTPS) for web requests
  - Create and set permissions for all the folders needed for the Docker services to run
  - Create a `filebrowser` configuration file
  - Create a docker compose file
  - Deploy the docker services

8. Click "Create Droplet" at the bottom of the screen and wait for your VM to be provisioned. This may take a few minutes while everything is set up, downloaded, and started.

9. Congratulations, your VM deployment should have been successful. You can test this by copying the IP address of your Droplet and pasting it into your browser's address bar. A success window should present from Nginx Proxy Manager.

## Configure your DNS Records
Exact details on how to do this is out of scope for these instructions as the process can vary significantly between domain registrars.

You will need to set up **A** records in your DNS configuration for your domain and/or any subdomains you wish to point at your Droplet VM.

All **A** records can point at the exact same IP address as we have a proxy manager handling and routing all of the requests.

#### Scenario
1. Our Digital Ocean Droplet IP address is 192.268.20.1
2. Our domain name is *mydomain.com.au*
3. We have three separate services we want to access remotely from different subdomains:
  - Nginx proxy manager at *admin.mydomain.com.au*
  - JATOS at *research.mydomain.com.au*
  - Filebrowser at *files.mydomain.com.au*

We can simply create three *A* records all pointing to the same IP address (192.168.20.1) and change the subdomain from *www* to the respective subdomain you wish to use. Any requests will be handled and routed by Nginx Proxy Manager with some minor configurations.

**Important Note:**\
These DNS records need to be implemented first before configuring Nginx Proxy Manager. DNS records need to be given time to propogate after configuring them. The time taken can range from immediate through to the heat death of the universe, although registrars typically advise anywhere from a few minutes to 24-hours.

## Setting up Nginx Proxy Manager
All incoming traffic to your droplet is only able to come in via port 80 or 443 (HTTP or HTTPS) thanks to the firewall we installed in the initialisation shell script.

Here we will configure Nginx Proxy Manager by adding entries for each service (JATOS and Filebrowser). We will also configure these services to *require* HTTPS (the secure protocol with encryption). This means that any requests coming in on port 80 (HTTP) will be automatically redirected to port 443 (HTTPS).

1. Navigate to Nginx Proxy Manager using the IP address given to you by Digital Ocean along with the port **81** in the format <IP address>:<port> (e.g., 192.168.20.1:81)
2. Log in using the following default credentials:
  - **Username:** admin@example.com
  - **Password:** changeme
3. Change the details and credentials of the primary admin user
  - Do **NOT** skip or cancel this step, your service is now publicly facing and you need to secure it properly

The below instructions start from your Nginx Proxy Manager dashboard.

#### Proxy Nginx Proxy Manager
First we need to proxy the proxy manager itself so we don't need to remember or use the IP address again.

In this example, we will proxy the Nginx Proxy Manager admin interface to the domain **admin.mydomain.com.au**

1. Click "Hosts" and select "Proxy Hosts" from the menu
2. Click "Add Proxy Host"
3. Enter your domain / subdomain into the "Domain Names" input and click the "Add" drop down or press enter
4. In the "Forward Hostname / IP" input, type in **host.docker.internal**
5. In the "Forward Port" input, type in **81**
6. Toggle the switches to cache assets and block common exploits. This helps to improve the server efficiency and address any simple or common security concerns\
**image**\
7. Click "SSL" in the menu, click the input area and select "Request a new SSL Certificate"
8. Toggle the switches to force SSL (redirect HTTP to HTTPS) and enable HTTP/2 support. Ensure the email is the correct one for the system administrator, read and accept the terms and conditions\
**image**\
9. Click "Save"
10. Congratulations, you have just configured your first proxied service. It may take a few minutes for your SSL certificates to be aranged. Test it out by going to the domain or subdomain you used (e.g., admin.mydomain.com.au)

#### Proxy JATOS
In this example, we will proxy the JATOS admin interface to the domain **research.mydomain.com.au**

1. Click "Hosts" and select "Proxy Hosts" from the menu
2. Click "Add Proxy Host"
3. Enter your domain / subdomain into the "Domain Names" input and click the "Add" drop down or press enter
4. In the "Forward Hostname / IP" input, type in **host.docker.internal**
5. In the "Forward Port" input, type in **9000**
6. Toggle the switches to cache assets and block common exploits. This helps to improve the server efficiency and address any simple or common security concerns\
**image**\
7. Click "SSL" in the menu, click the input area and select "Request a new SSL Certificate"
8. Toggle the switches to force SSL (redirect HTTP to HTTPS) and enable HTTP/2 support. Ensure the email is the correct one for the system administrator, read and accept the terms and conditions\
**image**\
9. Click "Save"
10. Congratulations, you've just set up another proxy. Test it out by going to the domain or subdomain you used (e.g., research.mydomain.com.au)

#### Proxy Filebrowser
In this example, we will proxy the Filebrowser admin interface to the domain **files.mydomain.com.au**

1. Click "Hosts" and select "Proxy Hosts" from the menu
2. Click "Add Proxy Host"
3. Enter your domain / subdomain into the "Domain Names" input and click the "Add" drop down or press enter
4. In the "Forward Hostname / IP" input, type in **host.docker.internal**
5. In the "Forward Port" input, type in **8080**
6. Toggle the switches to cache assets and block common exploits. This helps to improve the server efficiency and address any simple or common security concerns\
**image**\
7. Click "SSL" in the menu, click the input area and select "Request a new SSL Certificate"
8. Toggle the switches to force SSL (redirect HTTP to HTTPS) and enable HTTP/2 support. Ensure the email is the correct one for the system administrator, read and accept the terms and conditions\
**image**\
9. Click "Save"
10. Congratulations, you've just set up another proxy. Test it out by going to the domain or subdomain you used (e.g., files.mydomain.com.au)

## Completion
Congratulations, you now have a fully functioning system. Refer to the supplementary documentation on how to create an experiment in JATOS and how to upload assets to the experiment folder using Filebrowser.

### Some helpful resources
- [Jatos Documentation](https://www.jatos.org/Whats-JATOS.html)
- [jsPsych Documentation](https://www.jspsych.org/latest/)
- [Filebrowser Documentation](https://filebrowser.org/)
- [Nginx Proxy Manager Documentation](https://nginxproxymanager.com/guide/)
- [Digital Ocean Documentation](https://docs.digitalocean.com/)
