/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Flat ESLint configuration for Next.js + TypeScript frontend.
 * Owner: Quang Trung
 */
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [...nextVitals, ...nextTypeScript];

export default config;
