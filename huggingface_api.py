from huggingface_hub import InferenceClient
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)

client = InferenceClient(
    provider="hf-inference",  
    api_key="YOUR_API_KEY"  
)
@app.route('/summarize_code', methods=['POST'])
def summarize_code():
    data = request.json
    code_to_summarize = data.get("code")

    if not code_to_summarize:
        return jsonify({"error": "No code provided"}), 400

    prompt = f"Summarize the following code in a concise and clear way:\n\n{code_to_summarize}"

    try:
        response = client.text_generation(
            model="Qwen/Qwen2.5-Coder-32B-Instruct",  
            prompt=prompt,
            max_new_tokens=200
        )

        if response:
            return jsonify({"summary": response.strip()})
        else:
            return jsonify({"error": "No summary returned"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/error_detection_and_auto_fix', methods=['POST'])
def error_detection_and_auto_fix():
    data = request.json
    code_to_check = data.get("code")

    if not code_to_check:
        return jsonify({"error": "No code provided"}), 400

    prompt = f"""
    Analyze the following Python code for any syntax or logical errors. 
    If errors are detected, suggest corrections and provide the fixed code. 
    Do not add explanations or comments, just return the corrected code.

    Code:
    ```python
    {code_to_check}
    ```
    """

    try:
        response = client.text_generation(
            model="Qwen/Qwen2.5-Coder-32B-Instruct",  
            prompt=prompt,
            max_new_tokens=600
        )

        if response:
            
            cleaned_code = response.strip().replace("```python", "").replace("```", "").strip()
            return jsonify({"fixed_code": cleaned_code})
        else:
            return jsonify({"error": "No code returned"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/refactor_suggestions', methods=['POST'])
def refactor_suggestions():
    data = request.json
    code_to_review = data.get("code")

    if not code_to_review:
        return jsonify({"error": "No code provided"}), 400

    prompt = f"Review the following code and suggest improvements. Return a list of refactoring suggestions in bullet points:\n\n{code_to_review}"

    try:
        response = client.text_generation(
            model="Qwen/Qwen2.5-Coder-32B-Instruct",
            prompt=prompt,
            max_new_tokens=600
        )

        if response:
            return jsonify({"suggestions": response.strip()})
        else:
            return jsonify({"error": "No suggestions returned"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/complete_code', methods=['POST'])
def complete_code():
    data = request.json
    incomplete_code = data.get("code")

    if not incomplete_code:
        return jsonify({"error": "No code provided"}), 400

    
    messages = [{"role": "user", "content": f"Complete the code below and return only the code (no comments, explanations, or extra text):\n\n{incomplete_code}"}]
    
    try:
        completion = client.chat.completions.create(
            model="Qwen/Qwen2.5-Coder-32B-Instruct",  
            messages=messages,
            max_tokens=200
        )
        
        if completion.choices:
            completed_code = completion.choices[0].message["content"].strip()
            
            
            completed_code = completed_code.replace("#", "")  
        else:
            return jsonify({"error": "No code completion found"}), 500
        
        return jsonify({"completed_code": completed_code})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/refactor_code', methods=['POST'])
def refactor_code():
    data = request.json
    code_to_refactor = data.get("code")

    if not code_to_refactor:
        return jsonify({"error": "No code provided"}), 400

    messages = [
        {
            "role": "user",
            "content": f"Refactor the following code and return only the refactored code, without any explanations, comments, or extra text:\n\n{code_to_refactor}"
        }
    ]

    try:
        completion = client.chat.completions.create(
            model="Qwen/Qwen2.5-Coder-32B-Instruct",  
            messages=messages,
            max_tokens=500
        )
        
        if completion.choices:
            refactored_code = completion.choices[0].message["content"].strip()
            
    
            refactored_code = "\n".join(
                line for line in refactored_code.split("\n") if not line.strip().startswith("#")
            )
        else:
            return jsonify({"error": "No refactored code returned"}), 500

        return jsonify({"refactored_code": refactored_code})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000)  
