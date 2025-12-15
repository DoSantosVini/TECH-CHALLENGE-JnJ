'use client';

import React, {
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* =========================
   TIPOS
========================= */
type Status = 'active' | 'inactive';

type Person = {
  id: string;
  name: string;
  position: string;
  management: string;
  status: Status;
};

type Group = {
  name: string;
  manager?: Person;
  members: Person[];
};

/* =========================
   MOCK
========================= */
const people: Person[] = [
  { id: '1', name: 'Carlos Silva', position: 'Diretor', management: 'Tecnologia', status: 'active' },
  { id: '2', name: 'Beatriz Costa', position: 'Gerente', management: 'Tecnologia', status: 'active' },
  { id: '3', name: 'Pedro Souza', position: 'Dev', management: 'Tecnologia', status: 'active' },
  { id: '4', name: 'Ana Martins', position: 'Dev', management: 'Tecnologia', status: 'inactive' },

  { id: '5', name: 'Mariana Rocha', position: 'Diretora', management: 'Financeiro', status: 'active' },
  { id: '6', name: 'João Pereira', position: 'Gestor', management: 'Financeiro', status: 'active' },

  { id: '7', name: 'Lucas Almeida', position: 'Gerente', management: 'RH', status: 'active' },
  { id: '8', name: 'Sofia Lima', position: 'Analista', management: 'RH', status: 'active' },
];

/* =========================
   BOLHA BASE
========================= */
function Bubble({
  size,
  color,
  children,
  refProp,
}: {
  size: 'lg' | 'md' | 'sm';
  color: string;
  children: React.ReactNode;
  refProp?: (el: HTMLDivElement | null) => void;
}) {
  const sizes = {
    lg: 'w-32 h-32',
    md: 'w-24 h-24',
    sm: 'w-16 h-16',
  };

  return (
    <div
      ref={refProp}
      className={`
        ${sizes[size]}
        rounded-full
        flex items-center justify-center text-center
        shadow-md
        transition-transform
        ${color}
      `}
    >
      {children}
    </div>
  );
}

/* =========================
   CORES POR GERÊNCIA (ENTERPRISE)
========================= */
const GROUP_COLOR_MAP: Record<string, string> = {
  Tecnologia: 'bg-slate-700 text-white',
  Financeiro: 'bg-blue-700 text-white',
  RH: 'bg-teal-700 text-white',
};

function getGroupColor(name: string) {
  return GROUP_COLOR_MAP[name] || 'bg-gray-300 text-gray-900';
}

/* =========================
   COMPONENTE PRINCIPAL
========================= */
export default function BubbleOrganizationChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  const orgRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const managerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const memberRefs = useRef<Record<string, HTMLDivElement[]>>({});

  const [orgOpen, setOrgOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [expandedMembers, setExpandedMembers] = useState<Record<string, boolean>>({});
  const [lines, setLines] = useState<
    { x1: number; y1: number; x2: number; y2: number }[]
  >([]);

  /* =========================
     AGRUPAMENTO
  ========================= */
  const groups: Group[] = useMemo(() => {
    const map: Record<string, Person[]> = {};
    people.forEach((p) => {
      if (!map[p.management]) map[p.management] = [];
      map[p.management].push(p);
    });

    return Object.entries(map).map(([name, members]) => {
      const manager =
        members.find((m) =>
          /diretor|gerente|gestor/i.test(m.position)
        ) || members[0];

      return {
        name,
        manager,
        members: members.filter((m) => m.id !== manager.id),
      };
    });
  }, []);

  /* =========================
     LINHAS
  ========================= */
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const cRect = containerRef.current.getBoundingClientRect();

    const centerTop = (el: HTMLDivElement | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left - cRect.left + r.width / 2, y: r.top - cRect.top };
    };

    const centerBottom = (el: HTMLDivElement | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left - cRect.left + r.width / 2, y: r.bottom - cRect.top };
    };

    const newLines: typeof lines = [];

    if (orgOpen && orgRef.current) {
      const orgBottom = centerBottom(orgRef.current);

      groups.forEach((g) => {
        const gTop = centerTop(groupRefs.current[g.name]);
        if (orgBottom && gTop) {
          newLines.push({ x1: orgBottom.x, y1: orgBottom.y, x2: gTop.x, y2: gTop.y });
        }

        if (openGroups[g.name]) {
          const gBottom = centerBottom(groupRefs.current[g.name]);
          const mTop = centerTop(managerRefs.current[g.name]);
          if (gBottom && mTop) {
            newLines.push({ x1: gBottom.x, y1: gBottom.y, x2: mTop.x, y2: mTop.y });
          }

          if (expandedMembers[g.name]) {
            (memberRefs.current[g.name] || []).forEach((el) => {
              const mBottom = centerBottom(managerRefs.current[g.name]);
              const memTop = centerTop(el);
              if (mBottom && memTop) {
                newLines.push({ x1: mBottom.x, y1: mBottom.y, x2: memTop.x, y2: memTop.y });
              }
            });
          }
        }
      });
    }

    setLines(newLines);
  }, [orgOpen, openGroups, expandedMembers, groups]);

  /* =========================
     RENDER
  ========================= */
  return (
    <div ref={containerRef} className="relative min-h-[900px] py-12 bg-gray-50">

      {/* LINHAS */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {lines.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="#CBD5E1"
            strokeWidth="2"
          />
        ))}
      </svg>

      {/* ORGANIZAÇÃO */}
      <div className="flex justify-center mb-24">
        <div onClick={() => setOrgOpen(!orgOpen)} className="cursor-pointer">
          <Bubble
            size="lg"
            color="bg-[#EB1700] text-white hover:scale-105"
            refProp={(el) => (orgRef.current = el)}
          >
            <span className="font-bold text-lg">Organização</span>
          </Bubble>
        </div>
      </div>

      {/* GERÊNCIAS */}
      <AnimatePresence>
        {orgOpen && (
          <motion.div className="flex justify-center gap-20 flex-wrap">
            {groups.map((g) => (
              <div key={g.name} className="flex flex-col items-center gap-10">
                <div
                  onClick={() =>
                    setOpenGroups((p) => ({ ...p, [g.name]: !p[g.name] }))
                  }
                  className="cursor-pointer"
                >
                  <Bubble
                    size="md"
                    color={`${getGroupColor(g.name)} hover:scale-105`}
                    refProp={(el) => (groupRefs.current[g.name] = el)}
                  >
                    <span className="text-sm font-semibold">{g.name}</span>
                  </Bubble>
                </div>

                {openGroups[g.name] && (
                  <>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedMembers((p) => ({ ...p, [g.name]: !p[g.name] }));
                      }}
                      className="cursor-pointer"
                    >
                      <Bubble
                        size="sm"
                        color="bg-green-600 text-white hover:scale-110"
                        refProp={(el) => (managerRefs.current[g.name] = el)}
                      >
                        <div>
                          <strong className="text-sm">{g.manager?.name.split(' ')[0]}</strong>
                          <div className="text-[10px] opacity-90">{g.manager?.position}</div>
                        </div>
                      </Bubble>
                    </div>

                    {expandedMembers[g.name] && (
                      <div className="flex gap-4 flex-wrap justify-center">
                        {g.members.map((m, i) => (
                          <Bubble
                            key={m.id}
                            size="sm"
                            color={
                              m.status === 'active'
                                ? 'bg-gray-400 text-white'
                                : 'bg-gray-200 text-gray-600 opacity-70'
                            }
                            refProp={(el) => {
                              if (!memberRefs.current[g.name]) memberRefs.current[g.name] = [];
                              memberRefs.current[g.name][i] = el!;
                            }}
                          >
                            <div>
                              <span className="text-sm">{m.name.split(' ')[0]}</span>
                              <div className="text-[10px]">{m.position}</div>
                            </div>
                          </Bubble>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
