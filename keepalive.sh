#!/bin/bash
cd /home/z/my-project
while true; do
  bun --bun next dev -p 3000 -H :: 2>&1 | tee -a /home/z/my-project/dev.log
  echo "[$(date)] Server exited, restarting in 2s..." >> /home/z/my-project/dev.log
  sleep 2
done
