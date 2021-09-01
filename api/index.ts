import { ApolloServer } from "apollo-server-express";
import express from "express";

import { schema } from "./schema";
import { context } from "./context";

const main = async () => {
	const app = express();

	const server = new ApolloServer({
		schema,
		context,
	});
	await server.start();

	server.applyMiddleware({
		app: app,
		path: "/graphql",
	});

	const PORT = process.env.PORT || 4000;

	app.listen(PORT, () => {
		console.log(`🚀 Server started at http://localhost:${PORT}/graphql`);
	});
};

main().catch((err) => {
	console.log(err);
});
