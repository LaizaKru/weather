import { useRef } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import classNames from 'classnames'

import type { Observation, ObservationCreate } from '../types.ts'
import {
  useAddObservationMutation,
  useUpdateObservationMutation,
} from '../services/observation.ts'
import { useGetWeathersQuery } from '../services/weather.ts'
import { useGetAuthorsQuery } from '../services/author.ts'

type Props = {
  observation?: Observation
  onSuccess?: () => void
}

export function ObservationForm({ observation, onSuccess }: Props) {
  const [addObservation, { isLoading: isAddObservationLoading }] =
    useAddObservationMutation()
  const [updateObservation, { isLoading: isUpdateObservationLoading }] =
    useUpdateObservationMutation()
  const isMutationLoading =
    isAddObservationLoading || isUpdateObservationLoading
  const { data: weathers, isLoading: isWeathersLoading } = useGetWeathersQuery()
  const { data: authors, isLoading: isAuthorsLoading } = useGetAuthorsQuery()

  const toast = useRef<Toast>(null)
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ObservationCreate>({
    defaultValues: observation
      ? {
          temp: observation.temp,
          weather: observation.weather,
          author: observation.author,
          comment: observation.comment,
        }
      : {
          temp: 0,
        },
  })
  const getFormErrorMessage = (name: keyof typeof errors) => {
    return errors[name] ? (
      <small className='p-error'>{errors[name]?.message}</small>
    ) : (
      <small className='p-error'>&nbsp;</small>
    )
  }

  const afterSubmit = () => {
    toast.current?.show({
      severity: 'success',
      summary: observation ? 'Запись изменена' : 'Запись добавлена',
      detail: 'Таблица обновлена',
    })
    reset()
    onSuccess?.()
  }
  const onSubmit: SubmitHandler<ObservationCreate> = (data) => {
    if (observation) {
      updateObservation({ id: observation.id, ...data }).then(afterSubmit)
    } else {
      addObservation(data).then(afterSubmit)
    }
  }

  return (
    <>
      <Toast ref={toast} />
      <div className='flex justify-content-center'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-2 w-full'
        >
          <Controller
            name='temp'
            control={control}
            rules={{
              required: 'Температура обязательна для заполнения',
              validate: (value) => {
                if (value < -50) {
                  return 'Температура должна быть больше -50'
                }
                if (value > 60) {
                  return 'Температура должна быть меньше +60'
                }
                return true
              },
            }}
            render={({ field, fieldState }) => (
              <div className='flex flex-col gap-2'>
                <label htmlFor={field.name}>Температура</label>
                <InputNumber
                  id={field.name}
                  inputRef={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onValueChange={(e) => field.onChange(e)}
                  useGrouping={false}
                  inputClassName={classNames({ 'p-invalid': fieldState.error })}
                  minFractionDigits={0}
                  maxFractionDigits={2}
                  disabled={isMutationLoading}
                />
                {getFormErrorMessage(field.name)}
              </div>
            )}
          />
          <Controller
            name='weather'
            control={control}
            rules={{ required: 'Погода обязательна для заполнения' }}
            render={({ field, fieldState }) => (
              <div className='flex flex-col gap-2'>
                <label htmlFor={field.name}>Погода</label>
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel='title'
                  placeholder='Выберите погоду'
                  options={weathers}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  className={classNames({ 'p-invalid': fieldState.error })}
                  loading={isWeathersLoading}
                  disabled={isMutationLoading}
                />
                {getFormErrorMessage(field.name)}
              </div>
            )}
          />
          <Controller
            name='author'
            control={control}
            rules={{ required: 'Автор обязателен для заполнения' }}
            render={({ field, fieldState }) => (
              <div className='flex flex-col gap-2'>
                <label htmlFor={field.name}>Кто заполнил</label>
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel='name'
                  placeholder='Выберите автора'
                  options={authors}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  className={classNames({ 'p-invalid': fieldState.error })}
                  loading={isAuthorsLoading}
                  disabled={isMutationLoading}
                />
                {getFormErrorMessage(field.name)}
              </div>
            )}
          />
          <Controller
            name='comment'
            control={control}
            render={({ field, fieldState }) => (
              <>
                <label htmlFor={field.name}>Комментарий</label>
                <InputTextarea
                  id={field.name}
                  {...field}
                  rows={4}
                  cols={30}
                  className={classNames({ 'p-invalid': fieldState.error })}
                />
                {getFormErrorMessage(field.name)}
              </>
            )}
          />
          <Button
            label={observation ? 'Сохранить' : 'Добавить'}
            type='submit'
            icon='pi pi-check'
            loading={isMutationLoading}
          />
        </form>
      </div>
    </>
  )
}
