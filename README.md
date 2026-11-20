# CloudTier: AWS Three-Tier App Deployment

A production-style **three-tier web application** deployed on AWS. It has a React frontend served by Nginx, a Node.js backend and an Amazon RDS database. The tiers run inside a custom VPC behind an Application Load Balancer, with EC2 Auto Scaling.

This repository holds the **frontend landing page** (React + Vite + TypeScript), which describes the project and its architecture.

---

## 🏗️ Architecture

```
                    🌍 Internet / Users
                            │
┌───────────────────────────┼────────────── VPC (10.0.0.0/16) ─────────┐
│                           ▼                                          │
│               ⚖️ Application Load Balancer                           │
│                           │                                          │
│   ┌─────────── Public Subnets (AZ-a / AZ-b) ───────────┐             │
│   │   EC2: React + Nginx    │    EC2: React + Nginx    │  ← ASG      │
│   └─────────────────────────┬──────────────────────────┘             │
│                             ▼                                        │
│   ┌─────────── Private App Subnets ────────────────────┐             │
│   │   EC2: Node.js API      │    EC2: Node.js API      │  ← ASG      │
│   └─────────────────────────┬──────────────────────────┘  (NAT GW)   │
│                             ▼                                        │
│   ┌─────────── Private DB Subnets ─────────────────────┐             │
│   │   RDS Primary           │    RDS Standby (Multi-AZ)│             │
│   └────────────────────────────────────────────────────┘             │
└──────────────────────────────────────────────────────────────────────┘
```

## 🧰 Tech Stack

| Layer          | Technology         | Role                                                        |
| -------------- | ------------------ | ----------------------------------------------------------- |
| Frontend       | React / Nginx      | Nginx serves the SPA and proxies `/api` to the backend      |
| Backend        | Node.js            | REST API with the business logic, in private subnets        |
| Database       | Amazon RDS         | Managed relational DB in isolated subnets, Multi-AZ          |
| Networking     | VPC, public/private subnets | Isolates each tier; IGW + NAT Gateway routing       |
| Load Balancing | ALB                | Spreads traffic across healthy instances, runs health checks |
| Compute        | EC2 (+ Auto Scaling) | Instances that scale out and replace themselves on failure |

## 🔄 Request Flow

1. **User request**: the browser sends an HTTPS request to the ALB DNS name.
2. **ALB routing**: the ALB forwards it to a healthy frontend EC2 instance.
3. **Nginx proxy**: Nginx serves the React build and proxies `/api` to the Node.js tier.
4. **Business logic**: the Node.js API in a private subnet processes the request.
5. **Data access**: the API reads and writes RDS through a locked-down security group.

## 🔐 Security Groups (least privilege)

| Security Group | Inbound allowed from         |
| -------------- | ---------------------------- |
| `alb-sg`       | `0.0.0.0/0` on 80/443        |
| `web-sg`       | `alb-sg` on 80               |
| `app-sg`       | `web-sg` on the API port (e.g. 3000) |
| `db-sg`        | `app-sg` on 3306 / 5432      |

## 📚 What You'll Learn

- **VPC**: CIDR design, subnets, route tables, Internet and NAT gateways
- **EC2**: launch templates, AMIs, user-data bootstrapping, IAM instance roles
- **RDS**: subnet groups, Multi-AZ, parameter groups, secure connectivity
- **ALB**: target groups, listeners, health checks, path-based routing
- **Auto Scaling**: scaling policies, desired capacity, self-healing fleets
- **Security Groups**: rules chained tier to tier (ALB → Web → App → DB)

---

## 🚀 Run Locally

**Prerequisites:** Node.js 20+ and npm

```bash
npm install       # install dependencies
npm run dev       # start dev server at http://localhost:5173
npm run build     # production build into dist/
npm run preview   # preview the production build
npm run lint      # run ESLint
```

## 📦 Deploy the Frontend to EC2 (Nginx)

```bash
# On the EC2 instance (Amazon Linux 2023)
sudo dnf install -y nginx
sudo systemctl enable --now nginx

# Copy the build output
sudo cp -r dist/* /usr/share/nginx/html/
```

Sample Nginx config (`/etc/nginx/conf.d/app.conf`):

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://<internal-backend-alb-or-ip>:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Then run `sudo nginx -t && sudo systemctl reload nginx`.

## 📁 Project Structure

```
├── public/            # static assets (favicon, icons)
├── src/
│   ├── App.tsx        # landing page sections
│   ├── App.css        # landing page styles
│   ├── index.css      # global theme + resets
│   └── main.tsx       # React entry point
├── index.html
├── vite.config.ts
└── package.json
```

## 🛣️ Roadmap

- [x] Landing page (React + Vite)
- [ ] Node.js backend API
- [ ] RDS schema and connection
- [ ] VPC, subnets and security groups (IaC with Terraform/CloudFormation)
- [ ] ALB + Auto Scaling Groups
- [ ] CI/CD pipeline
