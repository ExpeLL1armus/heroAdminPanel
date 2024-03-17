import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import store from '../../store'

import {fetchFilters, activeFilterChanged, selectAll} from './filtersSlice'
import Spinner from '../spinner/Spinner';


const HeroesFilters = () => {

    const {filtersLoadingStatus, activeFilter} = useSelector(state => state.filters)
    const filters = selectAll(store.getState())
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFilters())
        // eslint-disable-next-line
    }, [])

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderFilterList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтров пока нет</h5>
        }

        return arr.map(({element, name, className}) => {
            const btnClass = classNames('btn', className, {
                'active': element === activeFilter
            });

            return <button
                        key={element}
                        className={btnClass} 
                        name={element} 
                        onClick={() => dispatch(activeFilterChanged(element))}>{name}</button> 
        })
    }

    const elements = renderFilterList(filters)

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;