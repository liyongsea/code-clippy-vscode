import * as vscode from 'vscode';
import CSConfig from './config';
import {getGenByTemplate} from "./api/api";

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		'extension.code-clippy-settings',
		() => {
			vscode.window.showInformationMessage('Show settings');
		}
	);

	context.subscriptions.push(disposable);

	const provider: vscode.CompletionItemProvider = {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		provideInlineCompletionItems: async (document, position, context, token) => {
			// Grab the api key from the extension's config
			const configuration = vscode.workspace.getConfiguration('', document.uri);
			const MODEL_NAME = configuration.get("conf.resource.hfModelName", "");
			const API_KEY = configuration.get("conf.resource.hfAPIKey", "");
			const USE_GPU = configuration.get("conf.resource.useGPU", false);

			// vscode.comments.createCommentController
			const textBeforeCursor = document.getText();
			if (textBeforeCursor.trim() === "") {
				return { items: [] };
			}
			const currLineBeforeCursor = document.getText(
				new vscode.Range(position.with(undefined, 0), position)
			);

			// Check if user's state meets one of the trigger criteria
			if (CSConfig.SEARCH_PHARSE_END.includes(textBeforeCursor[textBeforeCursor.length - 1]) || currLineBeforeCursor.trim() === "") {
				const result = await getGenByTemplate(textBeforeCursor);
				const completions = Array<string>();
				for (let i=0; i < result.data.data.length; i++) {
					completions.push(result.data.data[i].substring(textBeforeCursor.length));
				}
				const rs = {
					completions: completions,
				};

				
				if (rs == null) {
					return { items: [] };
				}

				// Add the generated code to the inline suggestion list
				const items: any[] = [];
				for (let i = 0; i < rs.completions.length; i++) {
					items.push({
						insertText: rs.completions[i],
						range: new vscode.Range(position.translate(0, rs.completions.length), position),
						trackingId: `snippet-${i}`,
					});
				}
				return { items };
			}
			return { items: [] };
		},
	};

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	vscode.languages.registerInlineCompletionItemProvider({ pattern: "**" }, provider);
}