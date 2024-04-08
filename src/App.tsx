import { useState, useCallback } from 'react'
import { Provider } from 'react-redux'
import { PrimeReactProvider } from 'primereact/api'
import { Panel } from 'primereact/panel'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

import { store } from './store.ts'
import { ObservationsTable } from './components/ObservationsTable.tsx'
import { ObservationForm } from './components/ObservationForm.tsx'
import { ObservationsCharts } from './components/ObservationsCharts.tsx'

function App() {
  const [addDialogVisible, setAddDialogVisible] = useState(false)
  const openAddDialog = useCallback(() => setAddDialogVisible(true), [])
  const closeAddDialog = useCallback(() => setAddDialogVisible(false), [])

  return (
    <PrimeReactProvider>
      <Provider store={store}>
        <Panel header='Дневник погоды' className='mb-3'>
          <ObservationsTable />
          <Button
            label='Добавить запись'
            icon='pi pi-plus-circle'
            onClick={openAddDialog}
            className='mt-4'
          />
        </Panel>
        <Panel header='Графики'>
          <ObservationsCharts />
        </Panel>
        <Dialog
          header='Создать запись'
          visible={addDialogVisible}
          onHide={closeAddDialog}
          style={{ width: '50vw' }}
        >
          <ObservationForm onSuccess={closeAddDialog} />
        </Dialog>
      </Provider>
    </PrimeReactProvider>
  )
}

export default App
