'use client'
import { useState } from 'react'
import {
  Video, Mic, MicOff, VideoOff, Phone, Users, MessageSquare,
  Share2, Settings2, Hand, MoreVertical, Send, Monitor, ScreenShare
} from 'lucide-react'

const PARTICIPANTS = [
  { id: 1, name: 'Azizbek K.', avatar: 'AK', muted: false, video: true, raised: false, speaking: true },
  { id: 2, name: 'Malika T.', avatar: 'MT', muted: true, video: true, raised: false, speaking: false },
  { id: 3, name: 'Jasur R.', avatar: 'JR', muted: true, video: false, raised: true, speaking: false },
  { id: 4, name: 'Bobur X.', avatar: 'BX', muted: false, video: true, raised: false, speaking: false },
  { id: 5, name: 'Nilufar E.', avatar: 'NE', muted: true, video: true, raised: false, speaking: false },
  { id: 6, name: 'Sherzod U.', avatar: 'SU', muted: true, video: false, raised: false, speaking: false },
]

const CHAT = [
  { id: 1, name: 'Azizbek K.', avatar: 'AK', text: 'Salom hamma!', time: '14:02' },
  { id: 2, name: 'Malika T.', avatar: 'MT', text: 'Dars boshlandimi?', time: '14:03' },
  { id: 3, name: 'Siz', avatar: 'DY', text: 'Ha, bir daqiqadan so\'ng boshlaymiz', time: '14:04', isMe: true },
  { id: 4, name: 'Jasur R.', avatar: 'JR', text: 'Savolim bor, qo\'l ko\'tardim', time: '14:15' },
]

export default function LivePage() {
  const [micOn, setMicOn] = useState(true)
  const [videoOn, setVideoOn] = useState(true)
  const [sharing, setSharing] = useState(false)
  const [chatOpen, setChatOpen] = useState(true)
  const [participantsOpen, setParticipantsOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const [chat, setChat] = useState(CHAT)

  const send = () => {
    if (!msg.trim()) return
    setChat([...chat, { id: Date.now(), name: 'Siz', avatar: 'DY', text: msg, time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }), isMe: true }])
    setMsg('')
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-bold text-base-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Jonli Dars · Python Asoslari
          </h1>
          <p className="text-xs text-base-500">00:42:18 · {PARTICIPANTS.length} ishtirokchi</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-rose text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            JONLI
          </span>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 grid lg:grid-cols-[1fr_320px] gap-3 overflow-hidden">

        {/* Video area */}
        <div className="flex flex-col gap-3 overflow-hidden">
          {/* Main video */}
          <div className="flex-1 card bg-black relative overflow-hidden min-h-0">
            {sharing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-base-900 to-base-950">
                <div className="text-center">
                  <Monitor className="w-16 h-16 text-sky-400 mx-auto mb-3 opacity-60" />
                  <p className="text-sm text-base-400">Ekran ulashish faol</p>
                  <p className="text-xs text-base-600 mt-1">VSCode - main.py</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-600/10 to-accent-600/10">
                <div className="w-32 h-32 rounded-full bg-sky-600/20 border-2 border-sky-600/30 flex items-center justify-center text-4xl font-bold text-sky-400 shadow-2xl">
                  DY
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="text-xs text-white bg-black/60 px-3 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1">
                    <Mic className="w-3 h-3" /> Dilnoza Yusupova (Siz)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Participant grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 flex-shrink-0">
            {PARTICIPANTS.map((p) => (
              <div key={p.id} className={`aspect-video rounded-xl relative overflow-hidden border-2 transition-colors
                ${p.speaking ? 'border-emerald-500 shadow-glow-emerald' : 'border-[#1E1E24]'}`}>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-base-800 to-base-900">
                  {p.video ? (
                    <div className="w-10 h-10 rounded-full bg-accent-600/30 border border-accent-600/40 flex items-center justify-center text-xs font-bold text-accent-300">
                      {p.avatar}
                    </div>
                  ) : (
                    <VideoOff className="w-5 h-5 text-base-600" />
                  )}
                </div>
                <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                  <span className="text-xs text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm truncate">
                    {p.name}
                  </span>
                  <div className="flex gap-0.5">
                    {p.muted && <MicOff className="w-3 h-3 text-rose-400 bg-black/60 p-0.5 rounded" />}
                    {p.raised && <Hand className="w-3 h-3 text-amber-400 bg-black/60 p-0.5 rounded" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="flex flex-col overflow-hidden">
          <div className="card flex flex-col flex-1 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#1E1E24] flex-shrink-0">
              <button onClick={() => { setChatOpen(true); setParticipantsOpen(false) }}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors border-b-2
                  ${chatOpen ? 'text-sky-400 border-sky-500' : 'text-base-500 border-transparent hover:text-base-300'}`}>
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
              <button onClick={() => { setChatOpen(false); setParticipantsOpen(true) }}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors border-b-2
                  ${participantsOpen ? 'text-sky-400 border-sky-500' : 'text-base-500 border-transparent hover:text-base-300'}`}>
                <Users className="w-4 h-4" />
                Ishtirokchilar ({PARTICIPANTS.length})
              </button>
            </div>

            {/* Chat */}
            {chatOpen && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chat.map(m => (
                    <div key={m.id} className={`flex gap-2 ${m.isMe ? 'flex-row-reverse' : ''}`}>
                      <div className="w-7 h-7 rounded-full bg-accent-600/20 border border-accent-600/30 flex items-center justify-center text-xs font-bold text-accent-400 flex-shrink-0">
                        {m.avatar}
                      </div>
                      <div className={`flex-1 ${m.isMe ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-2 text-xs text-base-600 mb-0.5 ${m.isMe ? 'justify-end' : ''}">
                          <span>{m.name}</span>
                          <span>·</span>
                          <span>{m.time}</span>
                        </div>
                        <div className={`inline-block px-3 py-1.5 rounded-xl text-xs max-w-xs
                          ${m.isMe ? 'bg-sky-600/15 text-sky-200 border border-sky-600/30' : 'bg-[#1A1A1F] text-base-300'}`}>
                          {m.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-[#1E1E24]">
                  <div className="flex gap-2">
                    <input value={msg} onChange={(e) => setMsg(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && send()}
                      className="input text-xs flex-1" placeholder="Xabar yozing..." />
                    <button onClick={send} className="btn-primary bg-sky-600 hover:bg-sky-700 p-2">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Participants */}
            {participantsOpen && (
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {PARTICIPANTS.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1A1A1F]">
                    <div className="w-8 h-8 rounded-full bg-accent-600/20 border border-accent-600/30 flex items-center justify-center text-xs font-bold text-accent-400">
                      {p.avatar}
                    </div>
                    <div className="flex-1 text-sm text-base-200">{p.name}</div>
                    <div className="flex items-center gap-1">
                      {p.raised && <Hand className="w-4 h-4 text-amber-400" />}
                      {p.muted ? <MicOff className="w-4 h-4 text-base-600" /> : <Mic className="w-4 h-4 text-emerald-500" />}
                      {!p.video && <VideoOff className="w-4 h-4 text-base-600" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mt-3 flex-shrink-0">
        <button onClick={() => setMicOn(!micOn)}
          className={`p-3 rounded-full transition-all ${micOn ? 'bg-[#1A1A1F] hover:bg-[#222229] text-base-200 border border-[#27272A]' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        <button onClick={() => setVideoOn(!videoOn)}
          className={`p-3 rounded-full transition-all ${videoOn ? 'bg-[#1A1A1F] hover:bg-[#222229] text-base-200 border border-[#27272A]' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
          {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>
        <button onClick={() => setSharing(!sharing)}
          className={`p-3 rounded-full transition-all ${sharing ? 'bg-sky-600/15 text-sky-400 border border-sky-600/30' : 'bg-[#1A1A1F] hover:bg-[#222229] text-base-200 border border-[#27272A]'}`}>
          <ScreenShare className="w-5 h-5" />
        </button>
        <button className="p-3 rounded-full bg-[#1A1A1F] hover:bg-[#222229] text-base-200 border border-[#27272A] transition-all">
          <Hand className="w-5 h-5" />
        </button>
        <button className="p-3 rounded-full bg-[#1A1A1F] hover:bg-[#222229] text-base-200 border border-[#27272A] transition-all">
          <Settings2 className="w-5 h-5" />
        </button>
        <button className="p-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium px-5 transition-all flex items-center gap-2">
          <Phone className="w-5 h-5" /> <span className="text-sm">Tugatish</span>
        </button>
      </div>
    </div>
  )
}
