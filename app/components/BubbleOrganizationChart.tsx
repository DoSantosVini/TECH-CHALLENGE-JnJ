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
  // agora suporta clique e cursor (opcional)
  return (
    <div
      ref={refProp}
      role={typeof (color) === 'string' ? undefined : undefined}
      className={`${sizes[size]} rounded-full flex items-center justify-center text-center shadow-lg ${color}`}
    >
      {children}
    </div>
  );
}

/* =========================
   MAPA DE CORES POR GERÊNCIA
========================= */
const GROUP_COLOR_MAP: Record<string, string> = {
  Tecnologia: 'bg-indigo-600 text-white',
  Financeiro: 'bg-yellow-500 text-white',
  RH: 'bg-pink-600 text-white',
};

function getGroupColor(name: string) {
  return GROUP_COLOR_MAP[name] || 'bg-gray-200 text-gray-900';
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
     CALCULO DAS LINHAS - RECOMPUTA COM DELAY
  ========================= */
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const cRect = containerRef.current.getBoundingClientRect();

    const top = (el: HTMLDivElement | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.left - cRect.left + r.width / 2,
        y: r.top - cRect.top,
      };
    };

    const bottom = (el: HTMLDivElement | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.left - cRect.left + r.width / 2,
        y: r.bottom - cRect.top,
      };
    };

    const newLines: typeof lines = [];

    // Linhas da Organização para as Gerências
    if (orgOpen && orgRef.current) {
      const orgBottom = bottom(orgRef.current);

      groups.forEach((g) => {
        const gTop = top(groupRefs.current[g.name]);

        if (orgBottom && gTop) {
          newLines.push({ x1: orgBottom.x, y1: orgBottom.y, x2: gTop.x, y2: gTop.y });
        }

        // Linhas da Gerência para o Gestor
        if (openGroups[g.name]) {
          const gBottom = bottom(groupRefs.current[g.name]);
          const mTop = top(managerRefs.current[g.name]);

          if (gBottom && mTop) {
            newLines.push({ x1: gBottom.x, y1: gBottom.y, x2: mTop.x, y2: mTop.y });
          }

          // Linhas do Gestor para os Colaboradores
          if (expandedMembers[g.name]) {
            (memberRefs.current[g.name] || []).forEach((el) => {
              const mBottom = bottom(managerRefs.current[g.name]);
              const memTop = top(el);

              if (mBottom && memTop) {
                newLines.push({
                  x1: mBottom.x,
                  y1: mBottom.y,
                  x2: memTop.x,
                  y2: memTop.y,
                });
              }
            });
          }
        }
      });
    }

    setLines(newLines);
  }, [orgOpen, openGroups, expandedMembers, groups]);

  /* =========================
     RECOMPUTA LINHAS APÓS ANIMAÇÕES CONCLUÍREM
  ========================= */
  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      if (!containerRef.current) return;

      const cRect = containerRef.current.getBoundingClientRect();

      const top = (el: HTMLDivElement | null) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left - cRect.left + r.width / 2,
          y: r.top - cRect.top,
        };
      };

      const bottom = (el: HTMLDivElement | null) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left - cRect.left + r.width / 2,
          y: r.bottom - cRect.top,
        };
      };

      const newLines: typeof lines = [];

      if (orgOpen && orgRef.current) {
        const orgBottom = bottom(orgRef.current);

        groups.forEach((g) => {
          const gTop = top(groupRefs.current[g.name]);

          if (orgBottom && gTop) {
            newLines.push({ x1: orgBottom.x, y1: orgBottom.y, x2: gTop.x, y2: gTop.y });
          }

          if (openGroups[g.name]) {
            const gBottom = bottom(groupRefs.current[g.name]);
            const mTop = top(managerRefs.current[g.name]);

            if (gBottom && mTop) {
              newLines.push({ x1: gBottom.x, y1: gBottom.y, x2: mTop.x, y2: mTop.y });
            }

            if (expandedMembers[g.name]) {
              (memberRefs.current[g.name] || []).forEach((el) => {
                const mBottom = bottom(managerRefs.current[g.name]);
                const memTop = top(el);

                if (mBottom && memTop) {
                  newLines.push({
                    x1: mBottom.x,
                    y1: mBottom.y,
                    x2: memTop.x,
                    y2: memTop.y,
                  });
                }
              });
            }
          }
        });
      }

      setLines(newLines);
    }, 350); // Aguarda animação Framer Motion (~300ms)

    return () => clearTimeout(timer);
  }, [orgOpen, openGroups, expandedMembers, groups]);

  /* =========================
     RENDER
  ========================= */
  return (
    <div ref={containerRef} className="relative min-h-[900px] py-10">

      {/* LINHAS */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {lines.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="#94A3B8"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
        ))}
      </svg>

      {/* LEGENDA */}
      <div className="flex justify-center mb-10">
        <div className="flex gap-6 bg-white px-6 py-3 rounded-full shadow-md text-sm text-gray-900">
          <Legend color="bg-blue-600 text-white" label="Organização (clique para abrir)" />
          <Legend color={getGroupColor('Tecnologia')} label="Gerências (clique para abrir)" />
          <Legend color="bg-green-500 text-white" label="Gestor (clique para expandir)" />
          <Legend color="bg-blue-400 text-white" label="Colaborador Ativo" />
          <Legend color="bg-gray-400 text-white" label="Colaborador Inativo" />
        </div>
      </div>

      {/* ORGANIZAÇÃO */}
      <div className="flex justify-center mb-20 z-10">
        <div
          onClick={() => setOrgOpen(!orgOpen)}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setOrgOpen(!orgOpen);
          }}
        >
          <Bubble size="lg" color="bg-blue-600 text-white" refProp={(el) => (orgRef.current = el)}>
            <span className="font-bold">Organização</span>
          </Bubble>
        </div>
      </div>

      {/* GERÊNCIAS */}
      <AnimatePresence>
        {orgOpen && (
          <motion.div className="flex justify-center gap-16 flex-wrap z-10">
            {groups.map((g) => (
              <div key={g.name} className="flex flex-col items-center gap-10">
                {/* Torna a bolha da gerência inteira clicável */}
                <div
                  onClick={() => setOpenGroups((p) => ({ ...p, [g.name]: !p[g.name] }))}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setOpenGroups((p) => ({ ...p, [g.name]: !p[g.name] }));
                    }
                  }}
                >
                  <Bubble
                    size="md"
                    color={getGroupColor(g.name)}
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
                      className="cursor-pointer transition-transform hover:scale-110"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          setExpandedMembers((p) => ({ ...p, [g.name]: !p[g.name] }));
                        }
                      }}
                    >
                      <Bubble
                        size="sm"
                        color="bg-green-500 text-white"
                        refProp={(el) => (managerRefs.current[g.name] = el)}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold">{g.manager?.name.split(' ')[0]}</span>
                          <small className="text-[10px] opacity-90">{g.manager?.position}</small>
                        </div>
                      </Bubble>
                    </div>

                    {expandedMembers[g.name] && (
                      <div className="flex gap-4 flex-wrap justify-center">
                        {g.members.map((m, i) => (
                          <div
                            key={m.id}
                            className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation();
                              }
                            }}
                          >
                            <Bubble
                              size="sm"
                              color={m.status === 'active' ? 'bg-blue-400 text-white' : 'bg-gray-400 text-white'}
                              refProp={(el) => {
                                if (!memberRefs.current[g.name]) memberRefs.current[g.name] = [];
                                memberRefs.current[g.name][i] = el!;
                              }}
                            >
                              <div className="flex flex-col items-center">
                                <span className="text-sm font-medium">{m.name.split(' ')[0]}</span>
                                <small className="text-[10px] opacity-90">{m.position}</small>
                              </div>
                            </Bubble>
                          </div>
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

/* =========================
   LEGENDA ITEM
========================= */
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full ${color}`} />
      <span className="text-gray-900">{label}</span>
    </div>
  );
}
