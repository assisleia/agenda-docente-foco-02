
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink, Check, Bell, FileText, Megaphone, Calendar } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import UrgencyBadge from './UrgencyBadge';
import { determineTaskUrgency, determineEventStatus, determineNewsValidity, EventCategory, TaskUrgency } from '@/utils/dateUtils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { differenceInDays } from 'date-fns';

export type EventType = 'event' | 'task' | 'news';

export interface CalendarEventProps {
  id: string;
  title: string;
  type: EventType;
  category?: EventCategory;
  startTime?: string;
  endTime?: string;
  startDate: Date;
  endDate?: Date;
  validUntil?: Date;
  description?: string;
  link?: string;
  isCompleted?: boolean;
  isRegistered?: boolean;
}

const CalendarEvent = ({
  id,
  title,
  type,
  category,
  startTime,
  endTime,
  startDate,
  endDate,
  validUntil,
  description,
  link,
  isCompleted: initialIsCompleted = false,
  isRegistered: initialIsRegistered = false
}: CalendarEventProps) => {
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered);
  const { toast } = useToast();
  
  // Calculate status based on event type
  const getStatus = (): TaskUrgency => {
    switch (type) {
      case 'task':
        return determineTaskUrgency(startDate, endDate);
      case 'event':
        return determineEventStatus(startDate);
      case 'news':
        return validUntil ? determineNewsValidity(validUntil) : 'onTime';
      default:
        return 'onTime';
    }
  };

  const status = getStatus();

  // Determine the color based on the timing - progress between start and end dates
  const getProgressColor = () => {
    const now = new Date();
    
    // If no end date, just return based on start date
    if (!endDate) {
      return "bg-green-100 border-green-500 text-green-800"; // At start
    }
    
    const totalDuration = differenceInDays(endDate, startDate);
    if (totalDuration <= 0) return "bg-green-100 border-green-500 text-green-800"; // Safety check
    
    const elapsedDuration = differenceInDays(now, startDate);
    
    // Already past end date
    if (now > endDate) {
      return "bg-orange-100 border-orange-500 text-orange-800";
    }
    
    // Just started (first 30% of the duration)
    if (elapsedDuration < totalDuration * 0.3) {
      return "bg-green-100 border-green-500 text-green-800";
    }
    // In the middle (30-70% of the duration)
    else if (elapsedDuration < totalDuration * 0.7) {
      return "bg-yellow-100 border-yellow-500 text-yellow-800";
    }
    // Near the end (last 30% of the duration)
    else {
      return "bg-orange-100 border-orange-500 text-orange-800";
    }
  };
  
  const getTypeBadge = () => {
    const typeNames = {
      'event': 'Evento',
      'task': 'Tarefa',
      'news': 'Notícia'
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`${getProgressColor()} text-xs font-normal`}
      >
        {typeNames[type]}
      </Badge>
    );
  };

  const getEventStyles = () => {
    const baseStyles = "p-2 rounded-md text-sm mb-1 border-l-4";
    
    // Type-specific styles
    const typeStyles = {
      event: "bg-purple-50 border-l-purple-500",
      task: "bg-pink-50 border-l-pink-500",
      news: "bg-violet-50 border-l-violet-500"
    };
    
    // Status-specific styles
    const statusStyles = {
      onTime: "border-green-500",
      medium: "border-yellow-500",
      urgent: "border-orange-500"
    };

    // Completed style
    const completedStyle = isCompleted || isRegistered ? "opacity-60" : "";
    
    return cn(baseStyles, typeStyles[type], statusStyles[status], completedStyle);
  };

  const getIcon = () => {
    switch (type) {
      case 'event':
        return <Bell className="h-4 w-4 text-purple-600" />;
      case 'task':
        return <FileText className="h-4 w-4 text-pink-600" />;
      case 'news':
        return <Megaphone className="h-4 w-4 text-violet-600" />;
      default:
        return null;
    }
  };

  const getTimeString = () => {
    if (startTime && endTime) {
      return `${startTime} - ${endTime}`;
    } else if (startTime) {
      return startTime;
    }
    return '';
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsCompleted(checked);
    // Here we would call an API to update the item status
    toast({
      title: checked ? "Tarefa concluída" : "Tarefa pendente",
      description: `A tarefa "${title}" foi marcada como ${checked ? 'concluída' : 'pendente'}.`
    });
    console.log(`Item ${id} marcado como ${checked ? 'concluído' : 'pendente'}`);
  };

  const handleRegistration = (checked: boolean) => {
    setIsRegistered(checked);
    if (checked) {
      // Here we would integrate with Microsoft Teams calendar
      toast({
        title: "Inscrição realizada",
        description: `Você se inscreveu no evento "${title}". O evento foi adicionado à sua agenda do Teams.`
      });
      console.log(`Inscrição no evento ${id} realizada`);
    } else {
      toast({
        title: "Inscrição cancelada",
        description: `Sua inscrição no evento "${title}" foi cancelada.`
      });
      console.log(`Inscrição no evento ${id} cancelada`);
    }
  };

  const handleReadNews = (checked: boolean) => {
    setIsCompleted(checked);
    toast({
      title: checked ? "Notícia lida" : "Notícia marcada como não lida",
      description: `A notícia "${title}" foi marcada como ${checked ? 'lida' : 'não lida'}.`
    });
    console.log(`Notícia ${id} marcada como ${checked ? 'lida' : 'não lida'}`);
  };

  return (
    <div className={getEventStyles()}>
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
          {type === 'task' && (
            <Checkbox
              id={`check-${id}`}
              checked={isCompleted}
              onCheckedChange={handleCheckboxChange}
              className="mt-0.5"
            />
          )}
          {type === 'event' && (
            <Checkbox
              id={`register-${id}`}
              checked={isRegistered}
              onCheckedChange={handleRegistration}
              className="mt-0.5"
            />
          )}
          {type === 'news' && (
            <Checkbox
              id={`read-${id}`}
              checked={isCompleted}
              onCheckedChange={handleReadNews}
              className="mt-0.5"
            />
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              {getIcon()}
              <span className={cn("font-medium", (isCompleted || isRegistered) && "line-through")}>{title}</span>
              <div className="ml-2">{getTypeBadge()}</div>
            </div>
            {description && (
              <p className="text-xs text-gray-600 mt-1">{description}</p>
            )}
            {link && (
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-purple-700 hover:text-purple-900 flex items-center gap-1 mt-1"
              >
                <ExternalLink className="h-3 w-3" /> Ver detalhes
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {(startTime || endTime) && (
            <span className="text-xs text-gray-500">{getTimeString()}</span>
          )}
          <UrgencyBadge type={type} level={status} category={category} />
        </div>
      </div>
    </div>
  );
};

export default CalendarEvent;
