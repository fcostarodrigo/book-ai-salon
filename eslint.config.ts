import { sheriff, type SheriffSettings, tseslint } from "eslint-config-sheriff";

const sheriffOptions: SheriffSettings = {
  react: true,
};

export default tseslint.config(sheriff(sheriffOptions), [
  {
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-console": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
      ],
    },
  },
]);
