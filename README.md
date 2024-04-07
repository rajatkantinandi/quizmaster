# Quizmaster

> Quizmaster is a free & open source app that allows users to create and host quizzes, adding an entertaining and knowledgeable element to any event.

Hosted via [vercel](https://quizmasterapp.in)

## Features

- All data is stored offline in indexedDB.
- You can create custom quizzes with various categories and questions.
- Or you can use a quiz from our curated catalog. (Files in the /data folder).
- You can download quizzes & share them with your friends or keep them as a backup.
- Later if you change your device or browser, you can import those downloaded quizzes. Or your friend can import quizzes you share with them and use them.
- Editing quizzes are saved as `draft` automatically once you save a question.
- The quiz editor supports `markdown` formatting or formatting like a Rich text editor.
- Host the quiz after creating.
- Can host the same quiz multiple times.
- While playing, progress is saved locally & next time loaded from there.
- Form teams by typing in team names or opt for random team generation.
- Flexibility to modify quiz settings like negative points, time limits, and the display of points while you’re hosting.

## Demo video

<div align="left">
  <a href="https://www.youtube.com/embed/2aGqrP1lpFw" aria-label="Play demo video">
    <img src="https://i.ytimg.com/vi/2aGqrP1lpFw/hqdefault.jpg" style="width:100%;aspect-ratio: 16 / 9;object-fit: cover;">
  </a>
</div>

## Upcoming / Roadmap

- Follow the issues list for upcoming [features / enhancement](https://github.com/rajatkantinandi/quizmaster/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement)
- Create an issue [here](https://github.com/rajatkantinandi/quizmaster/issues/new) for any bug report or a feature request.

## Contributing

- Fork the repo.

- Then clone your version on your computer:

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
