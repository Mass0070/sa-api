import { register } from "tsconfig-paths";

register({
    "baseUrl": "./dist",
    "paths": {
        "auth": ["auth"],
        "auth/*": ["auth/*"],
        "routes": ["routes"],
        "routes/*": ["routes/*"],
        "modules": ["modules"],
        "modules/*": ["modules/*"],
        "config": ["configs"],
        "config/*": ["configs/*"],
        "configs": ["configs"],
        "configs/*": ["configs/*"],
        "utils": ["utils"],
        "utils/*": ["utils/*"],
    }
});
