FROM emilrais/speciale-tool

COPY validation /alpha-api/validation
COPY mongo-lookup /alpha-api/mongo-lookup
COPY mongo-lookup-one /alpha-api/mongo-lookup-one
COPY mongo-store /alpha-api/mongo-store
COPY mongo-update /alpha-api/mongo-update
COPY facebook-inspect /alpha-api/facebook-inspect
COPY facebook-extend /alpha-api/facebook-extend
COPY response /alpha-api/response
COPY alpha-api.json /alpha-api/alpha-api.json

COPY update-user.json /alpha-api/update-user.json

ENTRYPOINT ["node", "/speciale-tool", "/alpha-api/alpha-api.json"]
