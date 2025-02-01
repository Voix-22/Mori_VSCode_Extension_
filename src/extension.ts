import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "Mori" is now active!');

    // Refactor Command
    
const disposableRefactor = vscode.commands.registerCommand('extension-vscode.refactorSelectedCode', async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const selectedText = editor.document.getText(editor.selection);

        if (!selectedText) {
            vscode.window.showErrorMessage('Please select some code to refactor.');
            return;
        }

        vscode.window.showInformationMessage('Sending code for refactoring...');

        try {
            
            const response = await axios.post('http://127.0.0.1:5000/refactor_code', {
                code: selectedText
            });

            const refactoredCode = response.data.refactored_code;

            if (refactoredCode) {

                const edit = new vscode.WorkspaceEdit();
                edit.replace(editor.document.uri, editor.selection, refactoredCode);
                await vscode.workspace.applyEdit(edit);

                vscode.window.showInformationMessage('Code refactored successfully!');
            } else {
                vscode.window.showErrorMessage('No refactored code returned.');
            }
        } catch (error) {
            const errorMessage = (error as any).message || 'Unknown error';
            vscode.window.showErrorMessage('Error in code refactoring: ' + errorMessage);
        }
    }
});

context.subscriptions.push(disposableRefactor);

const disposableErrorDetectionAndAutoFix = vscode.commands.registerCommand('extension-vscode.errorDetectionAndAutoFix', async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const code = editor.document.getText(editor.selection);
        if (!code) {
            vscode.window.showErrorMessage('Please select some code to detect errors.');
            return;
        }
        vscode.window.showInformationMessage('Sending code for error detection and auto-fixing...');

        try {
            
            const response = await axios.post('http://localhost:5000/error_detection_and_auto_fix', { code });

            
            console.log(response.data);

            const fixedCode = response.data.fixed_code;
            const error = response.data.error;

            if (error) {
                
                vscode.window.showErrorMessage(`Error Detected: ${error}`);
            } else if (fixedCode) {
                
                const cleanedCode = fixedCode.trim(); 
                
                
                const fixOption = await vscode.window.showInformationMessage('Would you like to auto-fix the code?', 'Yes', 'No');

                if (fixOption === 'Yes') {
                    
                    editor.edit(editBuilder => {
                        editBuilder.replace(editor.selection, cleanedCode);
                    });
                    vscode.window.showInformationMessage('Code has been auto-fixed!');
                } else {
                    vscode.window.showInformationMessage('No changes made.');
                }
            } else {
                vscode.window.showInformationMessage('No errors found.');
            }
        } catch (error: any) {
            
            vscode.window.showErrorMessage('Error with error detection and auto-fix service: ' + error.message);
        }
    }
});

context.subscriptions.push(disposableErrorDetectionAndAutoFix);


    
const disposableRefactorSuggestions = vscode.commands.registerCommand('extension-vscode.refactorSuggestions', async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const selectedText = editor.document.getText(editor.selection);

        if (!selectedText) {
            vscode.window.showErrorMessage('Please select some code to get refactoring suggestions.');
            return;
        }

        vscode.window.showInformationMessage('Fetching refactoring suggestions...');

        try {
            
            const response = await axios.post('http://127.0.0.1:5000/refactor_suggestions', {
                code: selectedText
            });

            console.log('Response data:', response.data); 

            const suggestions = response.data.suggestions;

            const splitText = (text: string, maxLength: number) => {
                const result = [];
                while (text.length > maxLength) {
                    result.push(text.substring(0, maxLength));
                    text = text.substring(maxLength);
                }
                if (text) {result.push(text);} 
                return result;
            };

            
            if (Array.isArray(suggestions)) {
                if (suggestions.length > 0) {
                    
                    const formattedSuggestions = suggestions
                        .map((suggestion: string, index: number) => {
                            const suggestionParts = splitText(suggestion, 1000); 
                            return suggestionParts
                                .map((part, partIndex) => `**Suggestion ${index + 1}.${partIndex + 1}:**\n${part}\n`)
                                .join('\n');
                        })
                        .join('\n');
                    
                    vscode.window.showInformationMessage(formattedSuggestions);
                } else {
                    vscode.window.showErrorMessage('No suggestions returned.');
                }
            } else if (typeof suggestions === 'string') {
                
                const suggestionParts = splitText(suggestions, 1000); 
                suggestionParts.forEach((part, index) => {
                    const formattedResponse = `**Refactoring Suggestion:**\n${part}`;
                    vscode.window.showInformationMessage(formattedResponse);
                });
            } else if (typeof suggestions === 'object') {
                
                let formattedObject = '**Refactoring Suggestions (Object):**\n';
                for (const [key, value] of Object.entries(suggestions)) {
                    const valueParts = splitText(value as string, 1000); 
                    formattedObject += `\n**${key}:**\n`;
                    valueParts.forEach((part, idx) => {
                        formattedObject += `${part}\n`;
                    });
                }
                vscode.window.showInformationMessage(formattedObject);
            } else {
                
                const errorMessage = 'Unexpected response format: suggestions is not an array, string, or object.';
                console.error(errorMessage, suggestions);
                vscode.window.showErrorMessage(errorMessage);
            }

        } catch (error) {
            console.error('Error fetching refactoring suggestions:', error);
            vscode.window.showErrorMessage('Error fetching refactoring suggestions: ' + (error as any).message);
        }
    }
});

context.subscriptions.push(disposableRefactorSuggestions);


const disposableSummarize = vscode.commands.registerCommand('extension-vscode.summarizeSelectedCode', async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const selectedText = editor.document.getText(editor.selection);

        if (!selectedText) {
            vscode.window.showErrorMessage('Please select some code to summarize.');
            return;
        }

        vscode.window.showInformationMessage('Summarizing selected code...');

        try {
            
            const response = await axios.post('http://127.0.0.1:5000/summarize_code', {
                code: selectedText
            });

            const summary = response.data.summary;

            if (summary) {
                vscode.window.showInformationMessage(`Summary: ${summary}`);
            } else {
                vscode.window.showErrorMessage('No summary returned.');
            }
        } catch (error) {
            const errorMessage = (error as any).message || 'Unknown error';
            vscode.window.showErrorMessage('Error in code summarization: ' + errorMessage);
        }
    }
});

context.subscriptions.push(disposableSummarize);


    
const disposableComplete = vscode.commands.registerCommand('extension-vscode.completeSelectedCode', async () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const selectedText = editor.document.getText(editor.selection);

            if (!selectedText) {
                vscode.window.showErrorMessage('Please select some code to complete.');
                return;
            }

            vscode.window.showInformationMessage('Sending code for completion...');

            try {
                
                const response = await axios.post('http://127.0.0.1:5000/complete_code', {
                    code: selectedText
                });

                const completedCode = response.data.completed_code;

                if (completedCode) {
    
                    const edit = new vscode.WorkspaceEdit();
                    edit.replace(editor.document.uri, editor.selection, completedCode);
                    await vscode.workspace.applyEdit(edit);

                    vscode.window.showInformationMessage('Code completed successfully!');
                } else {
                    vscode.window.showErrorMessage('No completed code returned.');
                }
            } catch (error) {
                const errorMessage = (error as any).message || 'Unknown error';
                vscode.window.showErrorMessage('Error in code completion: ' + errorMessage);
            }
        }
    });

    context.subscriptions.push(disposableComplete);


	
}

export function deactivate() {}
