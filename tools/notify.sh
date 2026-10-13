#!/bin/sh
# Mac notification: tools/notify.sh "Title" "Message" [sound] [say|ask]
# Shows a banner (from Script Editor, which is how macOS labels these), plays a sound, and with a 4th argument "say" also speaks the title,
# so you are alerted even if you miss the banner. Sounds: Glass (default), Ping, Funk, Sosumi, Basso.
T="${1:-Claude}"; M="${2:-Done}"; S="${3:-Glass}"
osascript -e 'on run argv' -e 'display notification (item 2 of argv) with title (item 1 of argv)' -e 'end run' -- "$T" "$M"
[ -f "/System/Library/Sounds/$S.aiff" ] && (afplay "/System/Library/Sounds/$S.aiff" >/dev/null 2>&1 &)
[ "$4" = "say" ] && (say "$T" >/dev/null 2>&1 &)
# "ask": for things that NEED you. A window that stays on screen until you click OK (up to an hour), plus the title spoken aloud.
if [ "$4" = "ask" ]; then
  (osascript -e 'on run argv' -e 'display dialog (item 2 of argv) with title (item 1 of argv) buttons {"OK"} default button "OK" with icon caution giving up after 3600' -e 'end run' -- "$T" "$M" >/dev/null 2>&1 &)
  (say "$T" >/dev/null 2>&1 &)
fi
exit 0
