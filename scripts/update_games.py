import json, os, urllib.request
from pathlib import Path
from datetime import datetime, timezone

ROOT=Path(__file__).resolve().parents[1]
games_path=ROOT/"games.json"
sources_path=ROOT/"sources.json"

data=json.loads(games_path.read_text())
sources=json.loads(sources_path.read_text())
existing={g["id"]:g for g in data.get("games",[])}

def fetch(url):
    req=urllib.request.Request(url,headers={"User-Agent":"LOWRES-updater/1.0"})
    with urllib.request.urlopen(req,timeout=15) as r:
        return json.loads(r.read().decode("utf-8"))

for source in sources.get("sources",[]):
    if not source.get("enabled"): continue
    if source.get("type")!="json": continue
    payload=fetch(source["url"])
    for item in payload.get("games",[]):
        # Feed owners are responsible for authorization. LOWRES still requires
        # an explicit license field and a playable URL before showing LAUNCH.
        if not item.get("title") or not item.get("playUrl") or not item.get("license"):
            continue
        license_name=str(item["license"]).lower()
        if license_name in {"unknown","all-rights-reserved","arr"}:
            continue
        slug="feed-"+str(abs(hash(item["playUrl"])))
        existing[slug]={
            "id":slug,
            "title":item["title"],
            "category":item.get("category","Arcade"),
            "description":item.get("description","Authorized feed entry."),
            "tags":item.get("tags",[]),
            "playable":True,
            "playUrl":item["playUrl"],
            "source":source["id"],
            "license":item["license"]
        }

data["games"]=list(existing.values())
data["verifiedCount"]=sum(1 for g in data["games"] if g.get("playable") and g.get("playUrl"))
data["generatedAt"]=datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
games_path.write_text(json.dumps(data,indent=2)+"\n")
print(f"LOWRES catalog: {len(data['games'])} entries / {data['verifiedCount']} verified")
