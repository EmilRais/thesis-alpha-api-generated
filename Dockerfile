FROM emilrais/speciale-tool

COPY validation /alpha-api/validation
COPY mongo-lookup /alpha-api/mongo-lookup
COPY mongo-store /alpha-api/mongo-store
COPY response /alpha-api/response
COPY alpha-api.json /alpha-api/alpha-api.json

ENTRYPOINT ["node", "/speciale-tool", "/alpha-api/alpha-api.json"]
