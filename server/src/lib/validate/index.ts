const validatationCompliance = {
  fio: {
    func: validateFio,
    errorMessage: 'Некорректный ФИО'
  },
  email: {
    func: validateEmail,
    errorMessage: 'Некоррректный e-mail'
  },
  password: {
    func: validatePassword,
    errorMessage: 'Пароль должен быть не менее 6 символов'
  }
}

export function validateFio (fio: string): boolean {
  return /^[a-zA-Zа-яА-ЯЁё ]+$/.test(fio)
}

export function validateEmail (email: string): boolean {
  return /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(email)
}

export function validatePassword (password: string): boolean {
  return password?.length >= 6
}

export function validateForm (form) {
  const errors = {}

  for (const key in form) {
    const validateKey = validatationCompliance[key]

    if (!validateKey) {
      continue
    }

    const result = validateKey.func(form[key])

    if (!result) {
      errors[key] = validateKey.errorMessage
    }
  }

  return Object.keys(errors).length ? errors : null
}