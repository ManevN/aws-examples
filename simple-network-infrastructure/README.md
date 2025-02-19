# Simple Network Infrastructure

- A basic network infrastructure for our frontend, API, and database, designed for a **single-instance** deployment with no focus on scalability or high availability.
    - **VPC** - A logical network boundary containing all network components.
    - **Internet Gateway** -Enables public internet access for resources in public subnets.
    - **Public Subnet**
        - **API** - Deployed in the public subnet and directly accessible from the internet.
    - **Private subnet**
        - Database - Isolated, not directly accessible from the internet.
    - **Cloudfront** - A CDN where the frontend React app is deployed.
        - API CORS - API must be configured to allow requests from the frontend.
    - **Security Group**s
        - API Security Groups
            - Allow inbound traffic on ports: 80 and 443 (HTTP and HTTPS)
            - Ensure HTTPS - The API should support HTTPS.
        - Database Security Groups
            - Allow inbound traffic only from the API

Limitations: Because we are not consider about scalability and high availability in this solution we will not have Load Balancer, Multiple AZ or Auto Scaling, so we directly exposing the API in the public subnet without an ALB (Application Load Balancer) 

- No Load Balancer - The API is directly exposed in the public subnet
- No Multi-AZ deployment - Both the API and database are deployed in a single availability zone, meaning there is not redundancy if the AZ fails.
- No Auto Scaling
    - The API runs as a single instance and does not scale automatically, meaning it won’t automatically handle increased traffic by adding more instances.
    - The database has no read replicas and does not automatically scale vertically (increased instance sized based on load)
