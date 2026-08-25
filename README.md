<a name="readme-top"></a>

<div align="center">
  <a href="https://github.com/harbanery/portfolio-me">
    <img src="./public/logo.png" alt="Logo" width="80">
  </a>

  <h1 align="center">Portfolio — Raihan Yusuf</h1>

  <p align="center">
    Personal portfolio website — projects, experience, and ways to connect.
    <br />
    <br />
    <a href="https://www.linkedin.com/in/raihan-yusuf" target="_blank">View LinkedIn</a>
  </p>
</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [The Story](#the-story)
- [Usage](#usage)
  - [Features](#features)
  - [Project Structure](#project-structure)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## About The Project

My personal portfolio website, built to present the work behind my name: selected projects with the roles and technology that shaped them, professional experience, writings, certifications, and the ways to reach me. The content is not hard-coded — it lives in a PostgreSQL database managed by a companion admin application, so every section renders from real data with considered empty states while content is still being prepared. An availability indicator keeps visitors informed about whether I am currently open to work.

### Built With

[![Next][Next.js]][Next-url]
[![TypeScript][TypeScript]][TypeScript-url]
[![Tailwind][Tailwind]][Tailwind-url]
[![Prisma][Prisma]][Prisma-url]
[![PostgreSQL][PostgreSQL]][PostgreSQL-url]

## The Story

After quite a long time, I finally decided to build this project. For years I never had a portfolio of my own — the work was always there, in repositories, in organizations, in things I shipped, but never gathered in one place that truly represented me. This website is that missing piece: a home for the projects I have built, the experience behind them, and the ways to reach me. It grew from a simple page into a database-driven site I can keep curating as my work evolves.

## Usage

The site is a single-page home (hero, skills marquee, about, experience, featured projects, writing, credentials) plus a project archive at `/projects` and a contact page with an email form. Navigation reflects the database: sections without data are hidden from the menus entirely.

### Features

- **Next.js App Router** with Server Components and Server Actions for data fetching.
- **Incremental Static Regeneration** (`revalidate = 60`) on the home, projects, and contacts pages — content stays in sync with the database without a rebuild.
- **Database-driven content** via **Prisma ORM** on **PostgreSQL**, managed by the separate admin-portfolio application.
- **Master skill data** (`masterDataMap`) with icons (`logoMap`, from react-icons) kept aligned with the admin application.
- **Home page sections** that adapt to the data: hero statistics hidden at zero, marquee falling back to the name, education with grades, languages, and an "Open to" block that hides when unavailable.
- **Empty-state behavior** — experience and project lists fall back to LinkedIn/GitHub cards, skills, writing, and credentials sections disappear along with their menu entries.
- **Availability indicator** shared between the navbar and contacts page (available / freelance only / busy).
- **Featured project cards** filtered to card-worthy skill categories (language, framework, library, database), resting in black & white and coloring up on hover.
- **Project archive** (`/projects`) grouped by year — a five-column table on laptops, stacked rows with a scroll-spy year menu on phones and tablets — linking to live sites or repositories.
- **Contact page** with an email form delivered through [Nodemailer](https://nodemailer.com/) SMTP (`/api/contact`) and a CV download proxied through `/api/file`.
- **Responsive design** tuned for phone, tablet, laptop (1024–1280px), and desktop breakpoints.
- **Motion & polish** with AOS scroll animations, Framer Motion, and Tailwind CSS v4 styling.
- **Per-page metadata** — the archive ships its own title and Open Graph artwork.
- **Analytics** via Vercel Analytics & Speed Insights.
- **Linting** with **ESLint** for maintaining code quality.

### Project Structure

```
src/
├── app/          # Routes & pages (App Router)
├── assets/       # Fonts & global styles
├── components/   # UI components (layout, navbar, footer, effects, etc.)
├── config/       # Environment variables
├── helpers/      # Pure helper functions
├── models/       # Data maps, master data & domain types
├── server/       # Server-only code (Prisma client & server actions)
├── services/     # Data services consumed by server actions
└── utils/        # Utilities (fonts, slug, cn)
```

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

## Contact

If you have any questions or inquiries regarding this project, feel free to contact me at [ryusuf05@gmail.com](mailto:ryusuf05@gmail.com)

## Acknowledgements

Special thanks go to [Brittany Chiang](https://v4.brittanychiang.com/) and [Faris Maulana](https://faris-portfolio-red.vercel.app/) — this portfolio's design takes much inspiration from their beautiful work. You guys should check it out!

Feel free to check it out:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [react-icons](https://react-icons.github.io/react-icons/)
- [lucide-react](https://lucide.dev/)
- [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)
- [Framer Motion](https://www.framer.com/motion/)
- [Nodemailer](https://nodemailer.com/)
- [Vercel](https://vercel.com/)
- [Img Shields](https://shields.io)
- [Choose an Open Source License](https://choosealicense.com/)

<!-- MARKDOWN LINKS & IMAGES -->

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Tailwind]: https://img.shields.io/badge/tailwindcss-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Prisma]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
