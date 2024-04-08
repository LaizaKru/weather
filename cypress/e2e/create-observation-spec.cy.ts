describe('Дневник наблюдений', () => {
  it('Пользователь может создать запись', () => {
    const obs = {
      temp: 40,
      weather: 'Солнечно',
      author: 'Иван Иванов',
      comment: 'Тестовый комментарий',
    }

    cy.visit('http://localhost:5173')

    // Нажимаем на кнопку "Добавить запись"
    cy.get('button').contains('Добавить запись').click()
    // Заполняем температуру
    cy.get('#temp').type(`${obs.temp}`)
    // Открываем выпадающий список "Погода"
    cy.get('#weather > .p-dropdown-label').click()
    // Выбираем опцию
    cy.get('.p-dropdown-items').contains(obs.weather).click()
    // Открываем выпадающий список "Кто заполнил"
    cy.get('#author > .p-dropdown-label').click()
    // Выбираем опцию
    cy.get('.p-dropdown-items').contains(obs.author).click()
    // Заполняем комментарий
    cy.get('#comment').type(obs.comment)
    // Нажимаем на кнопку "Добавить"
    cy.get('button[type="submit"]').click()

    // Проверяем, что запись добавлена
    const getLastRow = () => cy.get('.p-datatable-tbody > tr:last-child')
    getLastRow().should('exist')
    getLastRow().get('td:nth-child(2)').should('contain.text', obs.temp)
    getLastRow().get('td:nth-child(3)').should('contain.text', obs.weather)
    getLastRow().get('td:nth-child(4)').should('contain.text', obs.author)
    getLastRow().get('td:nth-child(5)').should('contain.text', obs.comment)
  })
})
