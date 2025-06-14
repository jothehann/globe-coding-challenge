import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';

export default [
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': plugin,
			prettier,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': 'warn',
			'prettier/prettier': 'error',
		},
	},
];
