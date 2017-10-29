FROM emilrais/speciale-tool

COPY mongo-lookup /alpha-api/mongo-lookup
COPY response /alpha-api/response
COPY alpha-api.json /alpha-api/alpha-api.json

ENTRYPOINT ["node", "/speciale-tool", "/alpha-api/alpha-api.json"]
