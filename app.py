import os, json, re
from flask import Flask, request, jsonify, render_template_string, send_from_directory

app = Flask(__name__, static_folder='dist', static_url_path='')

PAGE = """<body style="font-family:sans-serif;max-width:700px;margin:30px auto;background:#090d16;color:#e2e8f0;padding:20px">
<h1>Bug Buster (Fallback Mode)</h1>
<p>For the full modern UI, run: <code>npm run build</code> and restart the server.</p>
<input type=file id=f accept="image/*">
<button onclick=go() style="padding:8px 16px;background:#7c3aed;color:#fff;border:none;border-radius:6px;cursor:pointer">Analyze with Gemma 4</button>
<div id=o style="margin-top:20px"></div>
<script>
async function go(){
 if(!f.files[0]){alert('Please select an image');return;}
 const fd=new FormData();fd.append('img',f.files[0]);o.innerHTML='Analyzing screenshot with Gemma 4...';
 const d=await (await fetch('/analyze',{method:'POST',body:fd})).json();
 if(d.error){o.textContent='Error: '+d.error;return}
 const c=(t,x)=>`<div style="border:1px solid #334155;border-radius:8px;padding:12px;margin:10px 0;background:#0f172a"><b style="color:#a78bfa">${t}</b><br><div style="margin-top:6px">${x}</div></div>`;
 o.innerHTML=c('1. What is Wrong',d.problem||d.whatIsWrong)+c('2. Why it is Happening',d.why||d.whyItIsHappening)+c('3. How to Fix It','<ul><li>'+(d.fix||d.howToFix||[]).join('</li><li>')+'</li></ul>')+c('4. Immediate Next Action',`<code style="background:#1e293b;padding:4px 8px;border-radius:4px">${d.next_action||d.immediateNextAction}</code>`);
}
</script></body>"""

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    if os.path.exists(os.path.join(app.static_folder, "index.html")):
        return send_from_directory(app.static_folder, "index.html")
    return render_template_string(PAGE)

@app.post("/analyze")
def analyze():
    try:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return jsonify(error="GEMINI_API_KEY environment variable is not set"), 500
        
        from google import genai
        from google.genai import types

        model_name = os.environ.get("GEMMA_MODEL", "gemma-4-31b-it")
        client = genai.Client(api_key=api_key)
        prompt = 'Look at this error screenshot. Reply with ONLY JSON: {"problem":"...","why":"...","fix":["..."],"next_action":"..."}'

        img = request.files.get("img")
        if not img:
            return jsonify(error="No image file provided in request"), 400

        r = client.models.generate_content(
            model=model_name,
            contents=[
                types.Part.from_bytes(data=img.read(), mime_type=img.mimetype),
                prompt
            ]
        )
        cleaned = re.sub(r"```json|```", "", r.text).strip()
        return jsonify(json.loads(cleaned))
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))