

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/_components/ui/dialog";
import { Slider } from "@/_components/ui/slider";
import { PauseCircleIcon, PlayCircleIcon, Volume2Icon, VolumeXIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const STORAGE_KEY = "bg_music_state";

type State = {
  playing: boolean;
  muted: boolean;
  volume: number;
};

const defaultState: State = {
  playing: true,
  muted: false,
  volume: 0.5,
};

// Small floating control to play/pause and mute background music.
export const BackgroundMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [fetchStatus, setFetchStatus] = useState<Record<string, string> | null>(
    null
  );
  const [state, setState] = useState<State>(defaultState);
  const isFirstRender = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  const [needsInteraction, setNeedsInteraction] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = state.muted;
    audio.volume = state.volume;
    if (state.playing) {
      // Try to play (may fail due to browser autoplay policy)
      const p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          // autoplay allowed
          setNeedsInteraction(false);
        }).catch(() => {
          // Autoplay failed — stop playing and mark that we need interaction
          setState(s => ({ ...s, playing: false }));
          setNeedsInteraction(true);
        });
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [state.playing, state.muted, state.volume]);

  // Diagnostic: check if the audio files are reachable on the server (.mp3 and .ogg)
  useEffect(() => {
    const candidates = [
      { key: "mp3", url: "/audio/bg.mp3", type: "audio/mpeg" },
      { key: "ogg", url: "/audio/bg.ogg", type: "audio/ogg" },
    ];
    let cancelled = false;
    setFetchStatus({});
    Promise.all(
      candidates.map(c =>
        fetch(c.url, { method: "GET" })
          .then(res => {
            if (cancelled)
              return { key: c.key, status: `not-ok (${res.status})` };
            const ct = res.headers.get("content-type");
            if (res.ok) {
              return res.blob().then(blob => ({
                key: c.key,
                status: `ok (${ct ?? "unknown"}, ${blob.size} bytes)`,
              }));
            }
            return { key: c.key, status: `not-ok (${res.status})` };
          })
          .catch(() => ({ key: c.key, status: `error` }))
      )
    ).then(results => {
      if (cancelled) return;
      const map: Record<string, string> = {};
      results.forEach(r => {
        map[r.key] = r.status;
        console.log(`BackgroundMusic: ${r.key} ->`, r.status);
      });
      setFetchStatus(map);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // If user interacts (click) we can start playing — helpful to recover from autoplay block.
  const handlePlayToggle = () => {
    setState(s => ({ ...s, playing: !s.playing }));
  };

  const handleMuteToggle = () => {
    setState(s => ({ ...s, muted: !s.muted }));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setState(s => ({ ...s, volume: v }));
  };

  return (
    <>
      <Dialog open={needsInteraction} onOpenChange={setNeedsInteraction}>
        <DialogContent>
          <DialogTitle>Ativar música de fundo</DialogTitle>
          <DialogDescription>
            Essa música foi a que nos marcou desde o início do nosso namoro.{" "}
            Clique em ativar para permitir o áudio nesta sessão.
          </DialogDescription>
          <div className="mt-4">
            <div className="text-sm mb-2">Volume</div>
            <Slider
              value={[Math.round(state.volume * 100)]}
              onValueChange={(v: number[]) =>
                setState(s => ({ ...s, volume: v[0] / 100 }))
              }
              min={0}
              max={100}
              step={1}
            />
          </div>
          <DialogFooter>
            <div className="w-full flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setState(s => ({ ...s, playing: true, muted: false }));
                  setNeedsInteraction(false);
                }}
                className="px-6 py-2  rounded-md">
                Ativar música
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <audio
        ref={audioRef}
        loop
        preload="auto"
        aria-hidden
        onLoadedMetadata={() =>
          console.log(
            "BackgroundMusic: loaded metadata",
            audioRef.current && { duration: audioRef.current.duration }
          )
        }
        onCanPlay={() => console.log("BackgroundMusic: audio can play")}
        onCanPlayThrough={() =>
          console.log("BackgroundMusic: can play through")
        }
        onError={e => {
          console.error("BackgroundMusic: audio element error", e);
          try {
            const me = audioRef.current?.error as MediaError | null;
            if (me) {
              console.error("BackgroundMusic: mediaError", me, {
                code: me.code,
              });
            } else {
              console.error("BackgroundMusic: mediaError is null");
            }
          } catch (err) {
            console.error(err);
          }
        }}>
        <source src="/audio/bg.mp3" type="audio/mpeg" />
        <source src="/audio/bg.ogg" type="audio/ogg" />
      </audio>

      <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}>
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-2xl p-3 shadow-xl w-96 hidden md:block">
          {/* top row: image + play + title */}
          <div className="flex items-center space-x-3">
            <img
              src="/assets/Bg-music.png"
              alt="cover"
              className="w-[50px] h-[50px] rounded-md object-cover bg-gray-200"
            />


            <div className="flex-1 min-w-0 flex ">
              <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">
                Tu És A Razão
              </div>
              <div className="text-xs text-muted-foreground truncate">
                Recomeçar Music
                </div>
              </div>
            <button
              onClick={handlePlayToggle}
              aria-pressed={state.playing}
              title={state.playing ? "Pausar música" : "Tocar música"}
              className="w-12 h-12 rounded-lg flex items-center justify-center bg-slate-50 text-neutral-800">
              {state.playing ? <PauseCircleIcon />: <PlayCircleIcon/>}
            </button>
            </div>
          </div>

          {/* bottom row: volume and mute */}
          <div className="mt-3 flex items-center space-x-3">
            <button
              onClick={handleMuteToggle}
              title={state.muted ? "Desmutar" : "Mutar"}
              className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-800">
              {state.muted ? <VolumeXIcon/> : <Volume2Icon/>}
            </button>

            <div className="flex-1">
              <Slider
                value={[Math.round(state.volume * 100)]}
                onValueChange={(v: number[]) =>
                  setState(s => ({ ...s, volume: v[0] / 100 }))
                }
                min={0}
                max={100}
                step={1}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BackgroundMusic;