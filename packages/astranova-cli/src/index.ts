import { runCreateBE } from "./create-express";
import { runCreateReact } from "./create-react";

const args = process.argv.slice(2);

switch (args[0]) {
    case 'create-be':
        runCreateBE(args[1]);
        break;
    case 'create-fe':
        runCreateReact(args[1]);
        break;
    default:
        console.log('Usage: astranova-cli create-be <project-name>');
        process.exit(1);
}
