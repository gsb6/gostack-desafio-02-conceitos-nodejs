const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateUuid (request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response
      .status(400)
      .json({ error: 'Invalid project ID' });
  }

  return next();
}

function validateBody (request, response, next) {
  const { title, url, techs } = request.body;

  if (!title) {
    return response
      .status(400)
      .json({ error: 'Title is mandatory'});
  }

  if (!url) {
    return response
      .status(400)
      .json({ error: 'URL is mandatory'});
  }

  if (!techs) {
    return response
      .status(400)
      .json({ error: 'Techs are mandatory'});
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", validateUuid, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: 'Repository not found'})
  }

  const { likes } = repositories[repositoryIndex];

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateUuid, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: 'Repository not found'})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateUuid, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: 'Repository not found'})
  }

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
