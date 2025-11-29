from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Bathhouse
import os
import json

def init_database():
    """Инициализация базы данных с актуальными банками с Avito"""
    # Путь к базе данных
    DB_PATH = os.path.join(os.path.dirname(__file__), 'baths.db')
    
    print(f"🔧 Используется путь к БД: {DB_PATH}")
    
    # Создание подключения
    engine = create_engine(f'sqlite:///{DB_PATH}', echo=False)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Удаляем все таблицы и создаем заново для гарантии
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)
        print('✅ Таблицы пересозданы')
        
        # Проверяем, что таблица пуста
        count_before = session.query(Bathhouse).count()
        print(f'📊 Записей до очистки: {count_before}')
        
        # Актуальные бани с Avito (теперь с несколькими картинками)
        baths = [
            Bathhouse(
                name='Баня Викинг',
                description='В наличии. 6 метров на 2,4 метра. Премиум баня Викинг с уникальным дизайном и максимальным комфортом.',
                price=710000,
                image=json.dumps([
                    'image/viking/photo_2025-08-07_23-57-23.jpg',
                    'image/viking/photo_2025-08-07_23-57-24.jpg',
                    'image/viking/photo_2025-08-07_23-57-25.jpg',
                    'image/viking/photo_2025-08-07_23-57-25 (2).jpg',
                    'image/viking/photo_2025-08-07_23-57-26.jpg',
                    'image/viking/photo_2025-08-07_23-57-27.jpg',
                    'image/viking/photo_2025-08-07_23-57-28.jpg',
                    'image/viking/photo_2025-08-07_23-57-28 (2).jpg',
                    'image/viking/photo_2025-08-07_23-57-30.jpg',
                    'image/viking/photo_2025-08-07_23-57-31.jpg',
                    'image/viking/photo_2025-08-07_23-57-32.jpg',
                    'image/viking/photo_2025-08-07_23-57-33.jpg',
                    'image/viking/photo_2025-08-07_23-57-34.jpg',
                    'image/viking/photo_2025-08-07_23-57-37.jpg',
                    'image/viking/photo_2025-08-07_23-57-38.jpg',
                    'image/viking/photo_2025-08-07_23-57-39.jpg',
                    'image/viking/photo_2025-08-07_23-57-40.jpg',
                ], ensure_ascii=False),
                tags='баня,викинг,премиум',
                specs=json.dumps(['6 метров', '2,4 метра', 'Премиум качество'], ensure_ascii=False),
                features=json.dumps(['Уникальный дизайн', 'Максимальный комфорт', 'В наличии'], ensure_ascii=False)
            ),
            Bathhouse(
                name='Баня Квадро 3 метра в НАЛИЧИИ',
                description='Современная баня Квадро. Компактная, уютная, готова к установке.',
                price=275000,
                image=json.dumps([
                    'image/3x3/photo_2025-08-07_14-47-20.jpg',
                    'image/3x3/photo_2025-08-07_14-47-22.jpg',
                    'image/3x3/photo_2025-08-07_14-47-23.jpg',
                    'image/3x3/photo_2025-08-07_14-47-25.jpg',
                    'image/3x3/photo_2025-08-07_14-47-26.jpg',
                    'image/3x3/photo_2025-08-07_14-47-27.jpg',
                ], ensure_ascii=False),
                tags='баня,квадро',
                specs=json.dumps(['Квадро форма', 'Готова к установке'], ensure_ascii=False),
                features=json.dumps(['Современный дизайн', 'Компактность', 'Уют'], ensure_ascii=False)
            ),

            Bathhouse(
                name='Баня бочка квадро 4 метра',
                description='Просторная баня-бочка квадро 4 метра. Максимальный комфорт и качество.',
                price=380000,
                image=json.dumps([
                    'image/4x4/photo_2025-08-07_14-49-42.jpg',
                    'image/4x4/photo_2025-08-07_14-49-43.jpg',
                    'image/4x4/photo_2025-08-07_14-49-46.jpg',
                    'image/4x4/photo_2025-08-07_14-49-47.jpg',
                    'image/4x4/photo_2025-08-07_14-49-49.jpg',
                ], ensure_ascii=False),
                tags='баня,квадро,бочка',
                specs=json.dumps(['4 метра', 'Квадро форма'], ensure_ascii=False),
                features=json.dumps(['Просторная', 'Премиум отделка'], ensure_ascii=False)
            ),
            Bathhouse(
                name='Баня из кедра 5 метров',
                description='Баня из кедра 5 метров. Экологичность, долговечность, премиум качество.',
                price=435000,
                image=json.dumps([
                    'image/iskedra5m.webp',
                    'image/5x5/photo_2025-08-07_18-11-57.jpg',
                    'image/5x5/photo_2025-08-07_18-11-59.jpg',
                    'image/5x5/photo_2025-08-07_18-12-00.jpg',
                    'image/5x5/photo_2025-08-07_18-12-01.jpg',
                    'image/5x5/photo_2025-08-07_18-12-02.jpg',
                    'image/5x5/photo_2025-08-07_18-12-03.jpg',
                    'image/5x5/photo_2025-08-07_18-12-04.jpg',
                    'image/5x5/photo_2025-08-07_18-12-05.jpg',
                    'image/5x5/photo_2025-08-07_18-12-06.jpg',
                    'image/5x5/photo_2025-08-07_18-12-07.jpg',
                    'image/5x5/photo_2025-08-07_18-12-08.jpg',
                    'image/5x5/photo_2025-08-07_18-12-09.jpg',
                    ], ensure_ascii=False),
                tags='баня,кедр',
                specs=json.dumps(['5 метров', 'Кедр'], ensure_ascii=False),
                features=json.dumps(['Экологичность', 'Премиум качество'], ensure_ascii=False)
            ),
            Bathhouse(
                name='Баня бочка 2 метра',
                description='Компактная баня-бочка 2 метра. Идеальна для небольших участков.',
                price=215000,
                image=json.dumps([
                    'image/2x2/photo_2025-08-03_15-30-41.jpg',
                    'image/2x2/photo_2025-08-03_15-30-42.jpg',
                    'image/2x2/photo_2025-08-03_15-30-43.jpg',
                    'image/2x2/photo_2025-08-03_15-30-43 (2).jpg',
                    'image/2x2/photo_2025-08-03_15-30-44.jpg',
                    'image/2x2/photo_2025-08-03_15-30-45.jpg',
                    'image/2x2/photo_2025-08-03_15-30-46.jpg',
                    'image/2x2/photo_2025-08-03_15-30-46 (2).jpg',
                ], ensure_ascii=False),
                tags='баня,бочка',
                specs=json.dumps(['2 метра'], ensure_ascii=False),
                features=json.dumps(['Компактность', 'Быстрый прогрев'], ensure_ascii=False)
            ),

        ]
        
        # Добавляем записи одну за другой с проверкой
        for i, bath in enumerate(baths, 1):
            session.add(bath)
            print(f'➕ Добавлена баня {i}: {bath.name}')
        
        # Коммитим изменения
        session.commit()
        print(f'🎉 База данных обновлена! Добавлено {len(baths)} записей')
        
        # Финальная проверка
        total_count = session.query(Bathhouse).count()
        print(f'📊 Всего записей в базе после обновления: {total_count}')
        
        if total_count != len(baths):
            print(f'⚠️ ВНИМАНИЕ: Ожидалось {len(baths)} записей, но в базе {total_count}')
        
    except Exception as e:
        print(f'❌ Ошибка при инициализации БД: {e}')
        session.rollback()
        raise
    finally:
        session.close()

def check_database():
    """Проверка содержимого базы данных"""
    DB_PATH = os.path.join(os.path.dirname(__file__), 'baths.db')
    
    if not os.path.exists(DB_PATH):
        print(f'❌ Файл базы данных не найден: {DB_PATH}')
        return
    
    print(f'🔍 Проверяем базу данных: {DB_PATH}')
    
    engine = create_engine(f'sqlite:///{DB_PATH}', echo=False)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        print('\n📋 Текущее содержимое таблицы bathhouses:')
        print('=' * 80)
        
        baths = session.query(Bathhouse).all()
        
        if not baths:
            print('🔍 Таблица пуста!')
            return
        
        for bath in baths:
            print(f"ID: {bath.id}")
            print(f"Name: {bath.name}")
            print(f"Price: {bath.price:,} ₽")
            print(f"Images: {bath.images_list()}")
            print(f"Tags: {bath.tags}")
            print(f"Description: {bath.description[:50]}...")
            print(f"Specs: {bath.specs_list()}")
            print(f"Features: {bath.features_list()}")
            print('-' * 80)
            
    except Exception as e:
        print(f'❌ Ошибка при проверке БД: {e}')
    finally:
        session.close()

def force_recreate_database():
    """Принудительное пересоздание базы данных"""
    DB_PATH = os.path.join(os.path.dirname(__file__), 'baths.db')
    
    print(f'🔥 Принудительное пересоздание базы данных: {DB_PATH}')
    
    # Удаляем файл базы данных если он существует
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print('🗑️ Старый файл базы данных удален')
    
    # Создаем новую базу
    init_database()

if __name__ == '__main__':
    print("Выберите действие:")
    print("1. Обычное обновление базы данных")
    print("2. Принудительное пересоздание базы данных")
    print("3. Только проверка содержимого")
    
    choice = input("Введите номер (1-3): ").strip()
    
    if choice == '1':
        init_database()
        check_database()
    elif choice == '2':
        force_recreate_database()
        check_database()
    elif choice == '3':
        check_database()
    else:
        print("Неверный выбор. Выполняется обычное обновление...")
        init_database()
        check_database()