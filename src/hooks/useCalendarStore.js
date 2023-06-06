import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import { calendarApi } from "../../api";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {

    const dispatch = useDispatch();

    const { events, activeEvent } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth);

    const setActiveEvent = ( calendarEvent ) => {
      dispatch( onSetActiveEvent( calendarEvent ) );
    }

    const startSavingEvent = async ( calendarEvent ) => {

      try {
        
        // TODO: Update Event
        if( calendarEvent.id) {
            //Actualizando
            await calendarApi.put(`/events/${calendarEvent.id }`, calendarEvent)        
            dispatch( onUpdateEvent({ ...calendarEvent, user }) );
            return;
        }  
          // Creando
          const { data } = await calendarApi.post('/events', calendarEvent);
  
          dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }))

      } catch (error) {
        console.log(error)
        Swal.fire('Error al guardar', error.response.data.msg, 'error');
      }
      
    }

    const startDeletingEvent = async () => {
      //TODO: llegar al backend

      try {       
            //Eliminando
            await calendarApi.delete(`/events/${activeEvent.id }`);        
            dispatch( onDeleteEvent() )
            return;
      } catch (error) {
        console.log(error)
        Swal.fire('Error al eliminar', error.response.data.msg, 'error');
      }
      
    }

    const startLoadingEvents = async () => {
      try {
        
        const { data } = await calendarApi.get('/events');
        const events = convertEventsToDateEvents( data.eventos );
        dispatch( onLoadEvents( events ))
        console.log(events)

      } catch (error) {
        console.log('Error cargando eventos');
        console.log(error)
        
      }
    }

  return {
    //* propiedades 
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,
    //* metodos
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents
  }
}
