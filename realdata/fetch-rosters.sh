#!/bin/zsh
cd /Users/mattjack/Documents/Real-College-Dynasty/realdata
while IFS=$'\t' read -r id rest; do
  [ -s "espn-rosters/$id.json" ] && continue
  curl -sS -m 40 -A "Mozilla/5.0 (Macintosh)" "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/$id/roster" -o "espn-rosters/$id.json" || echo "fail $id"
  sleep 0.25
done < espn-team-ids.tsv
echo FINISHED
