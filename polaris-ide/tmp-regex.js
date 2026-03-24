const code = `
"use client";

import React, { useState } from 'react';
import { NextPage } from 'next';

const HomePage: NextPage = () => {
    return (
        <div className="p-4">
            <h1>Hello World</h1>
        </div>
    );
};

export default HomePage;
`;

let tsx = code;
tsx = tsx
    .replace(/^import\s+type\s+.+$/gm, "")
    .replace(/^import\s+.+$/gm, "")
    .replace(/^export\s+const\s+metadata\s*=[\s\S]*?;/gm, "")
    .replace(/^export\s+const\s+dynamic\s*=.*?;/gm, "")
    .replace(/^"use (?:client|server)";?$/gm, "")
    .replace(/^\s*export\s+default\s+(?:async\s+)?function\s+\w+[^(]*\([^)]*\)\s*(?::\s*[\w<>\.]+)?\s*\{/m, "")
    .replace(/^\s*(?:export\s+(?:default\s+)?)?const\s+\w+\s*(?::\s*[A-Za-z0-9_<>\.]+)?\s*=\s*(?:async\s+)?(?:\([^)]*\)|.*?)\s*=>\s*\{/m, "")
    .replace(/export\s+default\s+\w+;?\s*$/gm, "")
    .replace(/^\s*return\s*(?:\(\s*)?/m, "")
    .replace(/\)?\s*;?\s*\}?\s*;?\s*$/, "")
    .replace(/className=/g, "class=")
    .trim();

console.log("RESULT:");
console.log(tsx);
