import { fireEvent, render, screen } from "@testing-library/react"
import { FileSelector } from "./FileSelector"
import userEvent from "@testing-library/user-event"

describe('FileSelector', () => {
    beforeEach(() => {
        vitest.clearAllMocks()
    })
    it('should call onFileSelect with the correct file object when a valid .json file is uploaded', async () => {
        const user = userEvent.setup()
        const onFileSelect = vitest.fn()
        const onError = vitest.fn()
        const file = new File(['{"key": "value"}'], 'data.json', { type: 'application/json' })

        render(<FileSelector onFileSelect={onFileSelect} onError={onError} />)

        const inputLabel = screen.getByText(/choose export file/i)
        expect(inputLabel).toBeInTheDocument()
        await user.upload(inputLabel, file)
        expect(inputLabel).toHaveTextContent(/ready to convert/i)
        expect(onFileSelect).toBeCalledTimes(1)
        expect(onFileSelect).toBeCalledWith(file)
    })
    it('should correctly track onDrag events', () => {
        const getEventObject = (type: string) => {
            const file = new File(['test'], `export.${type}`, { type: `application/${type}` })
            return {
                dataTransfer: {
                    files: [file],
                    items: [{
                        kind: 'file',
                        type: file.type,
                        getAsFile: () => file
                    }],
                    types: ['Files']
                }
            }
        }
        const validObject = getEventObject('json')
        const invalidObject = getEventObject('pubg')

        const onFileSelect = vitest.fn()
        const onError = vitest.fn()
        render(<FileSelector onFileSelect={onFileSelect} onError={onError} />)

        const inputLabel = screen.getByText(/choose export file/i)
        expect(inputLabel).toBeInTheDocument()

        fireEvent.dragEnter(window, validObject)
        expect(inputLabel).toHaveTextContent(/drop/i)

        fireEvent.dragEnter(window, invalidObject)
        expect(inputLabel).toHaveTextContent(/choose .json/i)

        fireEvent.dragLeave(window)
        expect(inputLabel).not.toHaveTextContent(/drop/i)

    })
    it('should call onError when file is not .json', async () => {
        const onFileSelect = vitest.fn()
        const onError = vitest.fn()
        const file = new File(['{"key": "value"}'], 'data.png', { type: 'image/png' })

        render(<FileSelector onFileSelect={onFileSelect} onError={onError} />)

        const input = screen.getByLabelText(/choose export file/i)
        expect(input).toBeInTheDocument()
        fireEvent.change(input, { target: { files: [file] } })

        expect(onError).toBeCalledTimes(1)
        expect(onError).toBeCalledWith(expect.any(String))
    })
})