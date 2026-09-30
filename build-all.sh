#!/usr/bin/env bash
# Run from the repo root:  bash build-all.sh
# Builds every project and copies the output into live/projN/ so the
# landing page cards open the running app instead of the GitHub folder.
set -e
mkdir -p live

# Plain HTML projects (1 & 2): just copy the files.
# Each folder must contain an index.html (rename your main file if needed).
copy_static() { rm -rf "live/$2"; mkdir -p "live/$2"; cp -r "$1"/. "live/$2/"; }

# React projects (3-10): build, then copy the result.
build_react() {
  dir="$1"; slug="$2"
  echo "==> Building $dir"
  ( cd "$dir" && npm install
    if ls vite.config.* >/dev/null 2>&1; then
      npx vite build --base=./ --outDir dist        # Vite
    else
      PUBLIC_URL=. npm run build                    # Create React App
    fi )
  out="$dir/dist"; [ -d "$out" ] || out="$dir/build"
  rm -rf "live/$slug"; mkdir -p "live/$slug"; cp -r "$out"/. "live/$slug/"
}

copy_static "Proj 1(Counter App)"  proj1
copy_static "Proj 2(Grade System)" proj2
build_react "Proj 3(Academic Portal)/my-react-app3"   proj3
build_react "Proj 4(Hobby Card)/my-react-app4"        proj4
build_react "Proj 5(Calculator)/my-react-app5"        proj5
build_react "Proj 6(Attendance Tracker)/my-app6"      proj6
build_react "Proj 7(Form Validation)/my-app7"         proj7
build_react "Proj 8(Portfolio)/my-app8"               proj8
build_react "Proj 9(To Do App)/my-app9"               proj9
build_react "Proj 10(Report Card)/my-app10"           proj10

echo "Done. Now: git add live index.html && git commit -m 'Add live builds' && git push"
