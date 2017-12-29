FROM emilrais/speciale-tool

COPY modules /modules
COPY alpha-api-generated/validation /alpha-api/validation
COPY alpha-api-generated/alpha-api.json /alpha-api/alpha-api.json

COPY alpha-api-generated/update-user.json /alpha-api/update-user.json
COPY alpha-api-generated/update-post.json /alpha-api/update-post.json
COPY alpha-api-generated/delete-post.json /alpha-api/delete-post.json
COPY alpha-api-generated/alpha-api-user.json /alpha-api/alpha-api-user.json
COPY alpha-api-generated/facebook-user.json /alpha-api/facebook-user.json
COPY alpha-api-generated/all-documents.json /alpha-api/all-documents.json
COPY alpha-api-generated/by-id.json /alpha-api/by-id.json
COPY alpha-api-generated/board-posts.json /alpha-api/board-posts.json

ENTRYPOINT ["node", "/speciale-tool", "/alpha-api/alpha-api.json"]
