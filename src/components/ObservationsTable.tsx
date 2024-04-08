import { useCallback, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Message } from 'primereact/message'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

import { Observation } from '../types.ts'
import {
  useGetObservationsQuery,
  useDeleteObservationMutation,
} from '../services/observation.ts'
import { ObservationForm } from './ObservationForm.tsx'

const formatTimestamp = (timestamp: string) =>
  new Date(timestamp).toLocaleString('ru-RU')

export function ObservationsTable() {
  const { data, error, isLoading } = useGetObservationsQuery()
  const [deleteObservation] = useDeleteObservationMutation()
  const [editingRow, setEditingRow] = useState<Observation | null>(null)
  const openEditDialog = useCallback((row: Observation) => {
    setEditingRow(row)
  }, [])
  const closeEditDialog = useCallback(() => {
    setEditingRow(null)
  }, [])
  const renderTimestamp = useCallback(
    (row: Observation) => formatTimestamp(row.timestamp),
    [],
  )
  const renderActions = useCallback(
    (row: Observation) => (
      <div className='flex flex-wrap justify-content-center gap-3 mb-4'>
        <Button
          icon='pi pi-pen-to-square'
          aria-label='Редактировать'
          onClick={() => openEditDialog(row)}
        />
        <Button
          icon='pi pi-trash'
          severity='danger'
          aria-label='Удалить'
          onClick={() => {
            deleteObservation(row.id)
          }}
        />
      </div>
    ),
    [deleteObservation, openEditDialog],
  )

  if (error) {
    return <Message severity='error' text='Не удалось загрузить данные' />
  }

  return (
    <>
      <DataTable<Observation[]> value={data} loading={isLoading} stripedRows>
        <Column
          field='timestamp'
          header='Дата и время'
          body={renderTimestamp}
        />
        <Column field='temp' header='Температура' />
        <Column field='weather.title' header='Погода' />
        <Column field='author.name' header='Кто заполнил' />
        <Column field='comment' header='Комментарий' />
        <Column header='Действия' body={renderActions} />
      </DataTable>
      <Dialog
        header='Редактирование записи'
        visible={!!editingRow}
        onHide={closeEditDialog}
        style={{ width: '50vw' }}
      >
        <ObservationForm
          observation={editingRow!}
          onSuccess={closeEditDialog}
        />
      </Dialog>
    </>
  )
}
