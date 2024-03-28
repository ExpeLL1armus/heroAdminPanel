import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCharacter } from "../heroesList/heroesSlice";
import { useHttp } from "../../hooks/http.hook";
import {selectAll} from "../heroesFilters/filtersSlice"
import store from "../../store";

import { v4 as uuidv4 } from 'uuid';

const HeroesAddForm = () => {

    const {filtersLoadingStatus} = useSelector(state => state.filters)
    const filters = selectAll(store.getState())
    const dispatch = useDispatch();
    const {request} = useHttp();
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        element: ''
    })

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const addHero = (event) => {
        event.preventDefault();

        setFormData({
            ...formData,
            id: uuidv4()
        });

        request('http://localhost:3001/heroes', 'POST', JSON.stringify(formData))
            .then(res => dispatch(addCharacter(res)))
            .catch(err => console.log(err))
        
        setFormData({
            id: '',
            name: '',
            description: '',
            element: ''
        })
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0) {
            return filters.map(({element, name}) => {
                // eslint-disable-next-line
                if (element === 'all') return

                return <option key={element} value={element}>{name}</option>
            })
        }

    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={addHero}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="description" 
                    className="form-control" 
                    id="description" 
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={formData.element}
                    onChange={handleChange}>
                    <option >Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;