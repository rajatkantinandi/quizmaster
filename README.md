# Quizmaster

> Edit & create quizzes with different categories & points, share screen and host a quiz.

Hosted via [vercel](https://quizmaster.vercel.app/)

## Features

- All data is stored offline in indexedDB.
- Multiple local users can signup & create quizzes.
- One user can create multiple quizzes.
- Can play the same quiz multiple times.
- Editing quizzes are saved as `draft` automatically once you save a question.
- While playing, progress is saved locally & next time loaded from there.
- Grid - Question - Scorecard.
- Optional Timer for answering & choosing questions

## Upcoming / Roadmap

- Follow the issues list for upcoming [features / enhancement](https://github.com/rajatkantinandi/quizmaster/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement)
- Create an issue [here](https://github.com/rajatkantinandi/quizmaster/issues/new) for any bug report or a feature request.

## Contributing

- Clone repo:

```bash
git clone git@github.com:rajatkantinandi/quizmaster.git
```

- Go to the directory:

```bash
cd quizmaster
```

- Install packages:

```bash
npm ci
```

- Run locally:

```bash
npm start
```

- Create a new branch.
- Do your work.
- Commit.
- Create a new PR.
- Assign one of the contributors for review.
- Once a PR is created, it will be deployed to an environment via `vercel`, which you can open & test.
- Once the PR is approved, it can be squash merged, which will auto-deploy to the production environment.
- Happy contributing.
