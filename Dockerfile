FROM emilrais/speciale-tool

COPY modules /modules
COPY alpha-api-generated/validation /alpha-api/validation
COPY alpha-api-generated/alpha-api.json /alpha-api/alpha-api.json

COPY alpha-api-generated/update-user.json /alpha-api/update-user.json

ENTRYPOINT ["node", "/speciale-tool", "/alpha-api/alpha-api.json"]
