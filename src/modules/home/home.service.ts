/**
 * Home service
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

export const getHomePageHTML = (): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hono Starter - Professional API Backend</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --primary-light: #818cf8;
            --secondary: #8b5cf6;
            --accent: #ec4899;
            --dark: #0f172a;
            --dark-light: #1e293b;
            --gray: #64748b;
            --gray-light: #94a3b8;
            --bg: #f8fafc;
            --white: #ffffff;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.7;
            color: var(--dark);
            background: var(--bg);
            overflow-x: hidden;
        }

        .bg-animated {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%);
            z-index: -1;
        }

        .bg-animated::before {
            content: '';
            position: absolute;
            width: 200%;
            height: 200%;
            background-image:
                radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
            animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-50px, -50px); }
        }

        .container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 2rem;
            position: relative;
            z-index: 1;
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 0;
            margin-bottom: 2rem;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--white);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
        }

        .nav-link {
            color: rgba(255, 255, 255, 0.9);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s;
            padding: 0.5rem 1rem;
            border-radius: 8px;
        }

        .nav-link:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--white);
        }

        .nav-link.btn {
            background: var(--white);
            color: var(--primary);
            font-weight: 600;
        }

        .nav-link.btn:hover {
            background: rgba(255, 255, 255, 0.95);
            transform: translateY(-2px);
        }

        .hero {
            text-align: center;
            padding: 4rem 0 3rem;
            color: var(--white);
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: 0.5rem 1.2rem;
            border-radius: 50px;
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .hero h1 {
            font-size: 4.5rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            line-height: 1.1;
            background: linear-gradient(to bottom, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero p {
            font-size: 1.5rem;
            max-width: 700px;
            margin: 0 auto 3rem;
            opacity: 0.95;
            font-weight: 400;
        }

        .hero-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s;
            font-size: 1rem;
        }

        .btn-primary {
            background: var(--white);
            color: var(--primary);
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            color: var(--white);
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.25);
        }

        .main-content {
            background: var(--white);
            border-radius: 32px 32px 0 0;
            padding: 4rem 2rem;
            margin-top: 3rem;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 3rem 0;
        }

        .stat-card {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            padding: 2rem;
            border-radius: 16px;
            color: var(--white);
            text-align: center;
        }

        .stat-number {
            font-size: 3rem;
            font-weight: 800;
            display: block;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            font-size: 1rem;
            opacity: 0.95;
        }

        .card {
            background: var(--white);
            border-radius: 20px;
            padding: 2.5rem;
            margin: 3rem 0;
            border: 1px solid #e2e8f0;
            transition: all 0.3s;
        }

        .card:hover {
            box-shadow: 0 10px 40px rgba(99, 102, 241, 0.1);
            transform: translateY(-5px);
        }

        .card-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .card-icon {
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
        }

        .card h2 {
            color: var(--dark);
            font-size: 2rem;
            font-weight: 700;
            margin: 0;
        }

        .card p {
            color: var(--gray);
            line-height: 1.8;
            font-size: 1.05rem;
        }

        .tech-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .tech-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 2rem;
            border-radius: 16px;
            border: 2px solid transparent;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }

        .tech-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            transform: scaleX(0);
            transition: transform 0.3s;
        }

        .tech-card:hover {
            border-color: var(--primary-light);
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(99, 102, 241, 0.15);
        }

        .tech-card:hover::before {
            transform: scaleX(1);
        }

        .tech-card h3 {
            font-size: 1.3rem;
            margin-bottom: 0.75rem;
            color: var(--dark);
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .tech-card h3 span {
            font-size: 1.8rem;
        }

        .tech-card p {
            color: var(--gray);
            font-size: 0.95rem;
            line-height: 1.6;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .feature-card {
            background: var(--white);
            padding: 2rem;
            border-radius: 16px;
            border: 2px solid #e2e8f0;
            transition: all 0.3s;
            text-align: center;
        }

        .feature-card:hover {
            border-color: var(--primary);
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1);
        }

        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            display: block;
        }

        .feature-card h3 {
            font-size: 1.2rem;
            margin-bottom: 0.75rem;
            color: var(--dark);
        }

        .feature-card p {
            color: var(--gray);
            font-size: 0.95rem;
        }

        .endpoints-list {
            margin-top: 2rem;
        }

        .endpoint {
            background: var(--bg);
            padding: 1.25rem;
            margin: 0.75rem 0;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 1rem;
            font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
            border: 1px solid #e2e8f0;
            transition: all 0.3s;
        }

        .endpoint:hover {
            border-color: var(--primary);
            box-shadow: 0 5px 15px rgba(99, 102, 241, 0.1);
        }

        .method {
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-weight: 700;
            font-size: 0.8rem;
            letter-spacing: 0.5px;
            min-width: 70px;
            text-align: center;
        }

        .method.get { background: linear-gradient(135deg, #10b981, #059669); color: white; }
        .method.post { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
        .method.delete { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }

        .path {
            color: var(--primary);
            font-weight: 600;
            flex: 1;
            font-size: 0.95rem;
        }

        .endpoint-desc {
            color: var(--gray);
            font-size: 0.9rem;
        }

        .alert {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            padding: 1.5rem;
            border-radius: 12px;
            margin-top: 2rem;
            border-left: 4px solid #f59e0b;
            display: flex;
            gap: 1rem;
            align-items: start;
        }

        .alert-icon {
            font-size: 1.5rem;
        }

        .alert-content strong {
            color: var(--dark);
            display: block;
            margin-bottom: 0.25rem;
        }

        .code-block {
            background: var(--dark);
            color: #e2e8f0;
            padding: 2rem;
            border-radius: 12px;
            font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
            line-height: 1.8;
            overflow-x: auto;
            margin-top: 1.5rem;
            white-space: pre;
        }

        .folder { color: var(--primary-light); }
        .comment { color: var(--gray-light); }

        footer {
            background: var(--dark);
            color: var(--white);
            padding: 3rem 0;
            margin-top: 4rem;
            text-align: center;
        }

        footer a {
            color: var(--primary-light);
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s;
        }

        footer a:hover {
            color: var(--white);
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1.5rem;
            flex-wrap: wrap;
        }

        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .hero p { font-size: 1.1rem; }
            .nav-links { display: none; }
            .main-content { padding: 2rem 1rem; }
            .endpoint { flex-direction: column; align-items: start; }
        }
    </style>
</head>
<body>
    <div class="bg-animated"></div>

    <div class="container">
        <nav class="navbar">
            <a href="/" class="logo">🚀 Hono Starter</a>
            <div class="nav-links">
                <a href="/health" class="nav-link">Health</a>
                <a href="/doc" class="nav-link">API Docs</a>
                <a href="https://github.com/haykal-fe-verd/hono-starter" target="_blank" class="nav-link btn">GitHub</a>
            </div>
        </nav>

        <section class="hero">
            <div class="hero-badge">
                ⚡ Lightning Fast · 🔒 Type Safe · 🚀 Production Ready
            </div>
            <h1>Build APIs with<br>Modern Stack</h1>
            <p>Professional REST API starter template with Hono, Bun, TypeScript, and PostgreSQL</p>
            <div class="hero-buttons">
                <a href="/doc" class="btn btn-primary">📖 Explore API Docs</a>
                <a href="https://github.com/haykal-fe-verd/hono-starter" target="_blank" class="btn btn-secondary">
                    <span>⭐</span> Star on GitHub
                </a>
            </div>
        </section>
    </div>

    <div class="main-content">
        <div class="container">
            <div class="stats">
                <div class="stat-card">
                    <span class="stat-number">8+</span>
                    <span class="stat-label">Tech Stack</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">234+</span>
                    <span class="stat-label">Tests Passed</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">15+</span>
                    <span class="stat-label">API Endpoints</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">100%</span>
                    <span class="stat-label">Type Safe</span>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-icon">👨‍💻</div>
                    <h2>About This Project</h2>
                </div>
                <p>
                    <strong>Hono Starter</strong> is a REST API backend template built with a focus on
                    <strong>performance</strong>, <strong>type safety</strong>, and <strong>developer experience</strong>.
                    Powered by ultra-fast <strong>Hono</strong> framework running on <strong>Bun</strong> runtime.
                </p>
                <p style="margin-top: 1rem;">
                    This template is production-ready with complete features including JWT authentication, RBAC,
                    API documentation with OpenAPI/Scalar, comprehensive testing, and Docker support.
                </p>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-icon">🛠️</div>
                    <h2>Tech Stack</h2>
                </div>
                <div class="tech-grid">
                    <div class="tech-card">
                        <h3><span>⚡</span> Hono</h3>
                        <p>Ultra-fast web framework for edge computing. Faster than Express.js with modern and type-safe API.</p>
                    </div>
                    <div class="tech-card">
                        <h3><span>🦊</span> Bun</h3>
                        <p>Incredibly fast JavaScript runtime with built-in bundler, transpiler, and package manager.</p>
                    </div>
                    <div class="tech-card">
                        <h3><span>📘</span> TypeScript</h3>
                        <p>JavaScript superset with static typing for better code quality and developer experience.</p>
                    </div>
                    <div class="tech-card">
                        <h3><span>🗄️</span> PostgreSQL</h3>
                        <p>Powerful and reliable relational database for storing application data.</p>
                    </div>
                    <div class="tech-card">
                        <h3><span>🔷</span> Prisma ORM</h3>
                        <p>Next-generation ORM with type-safe query builder and auto-generated types.</p>
                    </div>
                    <div class="tech-card">
                        <h3><span>🔴</span> Redis</h3>
                        <p>In-memory data store for caching, session management, and rate limiting.</p>
                    </div>
                    <div class="tech-card">
                        <h3><span>🧪</span> Bun Test</h3>
                        <p>Built-in testing framework from Bun with Jest-compatible API and blazing fast execution.</p>
                    </div>
                    <div class="tech-card">
                        <h3><span>🔐</span> JWT</h3>
                        <p>JSON Web Token for secure and scalable stateless authentication.</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-icon">✨</div>
                    <h2>Features</h2>
                </div>
                <div class="features-grid">
                    <div class="feature-card">
                        <span class="feature-icon">🔐</span>
                        <h3>Authentication</h3>
                        <p>JWT-based auth with access & refresh tokens</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">👥</span>
                        <h3>User Management</h3>
                        <p>Complete CRUD with password hashing</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🎭</span>
                        <h3>RBAC</h3>
                        <p>Flexible role-based access control</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">⚡</span>
                        <h3>Rate Limiting</h3>
                        <p>Redis-based protection from abuse</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">📝</span>
                        <h3>API Docs</h3>
                        <p>OpenAPI with Scalar UI</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🧪</span>
                        <h3>Testing</h3>
                        <p>234+ comprehensive tests</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">📊</span>
                        <h3>Logging</h3>
                        <p>Structured Winston logger</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🐳</span>
                        <h3>Docker Ready</h3>
                        <p>Complete Docker setup</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-icon">🎯</div>
                    <h2>Project Structure</h2>
                </div>
                <p>This project uses <strong>modular architecture</strong> with clean and maintainable structure:</p>
                <div class="code-block">
<span class="folder">src/</span>
├── <span class="folder">modules/</span>          <span class="comment"># Feature modules</span>
│   ├── <span class="folder">auth/</span>        <span class="comment"># Authentication</span>
│   ├── <span class="folder">users/</span>       <span class="comment"># User management</span>
│   ├── <span class="folder">roles/</span>       <span class="comment"># Role management</span>
│   └── <span class="folder">permissions/</span> <span class="comment"># Permission management</span>
├── <span class="folder">middleware/</span>      <span class="comment"># Custom middleware</span>
├── <span class="folder">lib/</span>            <span class="comment"># Utilities & helpers</span>
└── <span class="folder">application/</span>    <span class="comment"># App configuration</span>
                </div>
            </div>
        </div>
    </div>

    <footer>
        <div class="container">
            <p style="font-size: 1.2rem; margin-bottom: 1rem;">Built with ❤️ using Hono + Bun + TypeScript</p>
            <p style="opacity: 0.8;">© 2026 Muhammad Haykal</p>
            <div class="footer-links">
                <a href="https://github.com/haykal-fe-verd" target="_blank">GitHub</a>
                <a href="https://hono.dev" target="_blank">Hono Docs</a>
                <a href="https://bun.sh" target="_blank">Bun Docs</a>
                <a href="/docs">API Documentation</a>
            </div>
        </div>
    </footer>
</body>
</html>
	`;
};
