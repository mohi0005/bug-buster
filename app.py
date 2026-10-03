import os, json, re
from flask import Flask, request, jsonify, render_template_string
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = os.environ["GEMMA_MODEL"]
PROMPT = 'Look at this error screenshot. Reply with ONLY JSON: {"problem":"...","why":"...","fix":["..."],"next_action":"..."}'

app = Flask(__name__)
PAGE = """<body style="font-family:sans-serif;max-width:700px;margin:30px auto">
<h1>BugBuster</h1><input type=file id=f accept=image/*>
<button onclick=go()>Analyze with Gemma 4</button><div id=o></div>
<script>
async function go(){
 const fd=new FormData();fd.append('img',f.files[0]);o.innerHTML='Analyzing...';
 const d=await (await fetch('/analyze',{method:'POST',body:fd})).json();
 if(d.error){o.textContent='Error: '+d.error;return}
 const c=(t,x)=>`<div style="border:1px solid #ccc;border-radius:8px;padding:10px;margin:8px 0"><b>${t}</b><br>${x}</div>`;
 o.innerHTML=c('Problem',d.problem)+c('Why',d.why)+c('Fix','<ul><li>'+d.fix.join('</li><li>')+'</li></ul>')+c('Next',d.next_action);
}
</script></body>"""

@app.get("/")
def home(): return render_template_string(PAGE)

@app.post("/analyze")
def analyze():
    try:
        img = request.files["img"]
        r = client.models.generate_content(model=MODEL, contents=[
            types.Part.from_bytes(data=img.read(), mime_type=img.mimetype), PROMPT])
        return jsonify(json.loads(re.sub(r"```json|```", "", r.text).strip()))
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))