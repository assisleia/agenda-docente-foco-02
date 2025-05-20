
import React, { useState } from 'react';
import Header from '@/components/Header';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import DayView from '@/components/calendar/DayView';
import WeekView from '@/components/calendar/WeekView';
import MonthView from '@/components/calendar/MonthView';
import SemesterView from '@/components/calendar/SemesterView';
import CalendarLegend from '@/components/calendar/CalendarLegend';
import { CalendarEventProps } from '@/components/calendar/CalendarEvent';
import { addDays, addMonths, addWeeks, subDays, subMonths, subWeeks } from 'date-fns';
import { Toaster } from '@/components/ui/toaster';
import { DatePicker } from '@/components/calendar/DatePicker';

// Sample events data with links and dates for automatic urgency calculation
const sampleEvents: CalendarEventProps[] = [
  {
    id: '1',
    title: 'Reunião de Departamento',
    type: 'event',
    category: 'jornadaDocente',
    startTime: '10:00',
    endTime: '11:30',
    startDate: new Date(), // Today
    description: 'Reunião mensal do departamento para discutir o calendário acadêmico',
    link: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: '2',
    title: 'Entrega de Notas',
    type: 'task',
    startDate: new Date(),
    endDate: addDays(new Date(), 2), // In 2 days
    description: 'Prazo final para entrega das notas do bimestre no sistema',
    link: 'https://www.ulife.com.br/notas'
  },
  {
    id: '3',
    title: 'Palestra sobre Metodologias Ativas',
    type: 'news',
    category: 'jornadaDocente',
    startDate: addDays(new Date(), 5), // In 5 days
    validUntil: addDays(new Date(), 15), // Valid for 15 days
    description: 'Palestra com especialista em metodologias ativas, aberta a todos os docentes',
    link: 'https://www.ulife.com.br/eventos/palestra-metodologias'
  },
  {
    id: '4',
    title: 'Conselho de Classe',
    type: 'event',
    category: 'institucional',
    startTime: '14:00',
    endTime: '17:00',
    startDate: addDays(new Date(), 10), // In 10 days
    description: 'Conselho de classe do 2º bimestre - participação obrigatória',
    link: 'https://www.ulife.com.br/eventos/conselho-classe'
  },
  {
    id: '5',
    title: 'Submissão de Plano de Aula',
    type: 'task',
    startDate: addDays(new Date(), -1), // Yesterday
    endDate: addDays(new Date(), 5),
    description: 'Prazo para submissão do plano de aula do próximo semestre',
    link: 'https://www.ulife.com.br/planos-aula',
    isCompleted: true
  },
  {
    id: '6',
    title: 'Workshop de Ferramentas Digitais',
    type: 'event',
    category: 'jornadaDocente',
    startTime: '09:00',
    endTime: '12:00',
    startDate: addDays(new Date(), 1), // Tomorrow
    description: 'Capacitação em ferramentas digitais para ensino remoto',
    link: 'https://www.ulife.com.br/eventos/workshop-ferramentas',
    isRegistered: true
  },
  {
    id: '7',
    title: 'Nova Política de Avaliação',
    type: 'news',
    category: 'institucional',
    startDate: addDays(new Date(), 1), // Tomorrow
    validUntil: addDays(new Date(), 30), // Valid for a month
    description: 'Divulgação da nova política de avaliação institucional',
    link: 'https://www.ulife.com.br/noticias/nova-politica-avaliacao'
  },
  {
    id: '8',
    title: 'Revisão de Provas',
    type: 'task',
    startDate: addDays(new Date(), 4), // In 4 days
    endDate: addDays(new Date(), 8),
    description: 'Período para revisão das provas finais',
    link: 'https://www.ulife.com.br/tarefas/revisao-provas'
  },
  {
    id: '9',
    title: 'Mostra de Iniciação Científica',
    type: 'event',
    category: 'jornadaDiscente',
    startTime: '13:00',
    endTime: '18:00',
    startDate: addDays(new Date(), 2), // In 2 days
    description: 'Apresentação dos projetos de iniciação científica dos alunos',
    link: 'https://www.ulife.com.br/eventos/mostra-ic'
  },
  {
    id: '10',
    title: 'Atualização do Material Didático',
    type: 'news',
    category: 'jornadaDocente',
    startDate: new Date(), // Today
    validUntil: addDays(new Date(), -1), // Already expired
    description: 'Novos materiais didáticos disponíveis na plataforma',
    link: 'https://www.ulife.com.br/noticias/materiais'
  }
];

const TeacherPage = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month' | 'semester'>('day'); // Added semester view
  
  const handlePrevious = () => {
    switch (view) {
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'semester':
        setCurrentDate(subMonths(currentDate, 6)); // Go back 6 months for semester view
        break;
    }
  };
  
  const handleNext = () => {
    switch (view) {
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'semester':
        setCurrentDate(addMonths(currentDate, 6)); // Go forward 6 months for semester view
        break;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header userType="teacher" userName="Professor" />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <h1 className="text-2xl font-bold mb-6 text-purple-800">Agenda Docente</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-3">
            <CalendarHeader 
              currentDate={currentDate}
              onPrevious={handlePrevious}
              onNext={handleNext}
              view={view}
              onViewChange={setView}
            />
            
            <CalendarLegend />
          </div>
          
          <div className="bg-white rounded-md shadow-sm p-3">
            <h3 className="text-sm font-semibold text-purple-800 mb-2">Navegador</h3>
            <DatePicker
              selected={currentDate}
              onSelect={(date) => date && setCurrentDate(date)}
            />
          </div>
        </div>
        
        <div>
          {view === 'day' && (
            <DayView date={currentDate} events={sampleEvents} />
          )}
          
          {view === 'week' && (
            <WeekView date={currentDate} events={sampleEvents} />
          )}
          
          {view === 'month' && (
            <MonthView date={currentDate} events={sampleEvents} />
          )}
          
          {view === 'semester' && (
            <SemesterView date={currentDate} events={sampleEvents} />
          )}
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default TeacherPage;
