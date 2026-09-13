/*
 * JavaStartSamples is simple console application contains several basic samples to ease java development experience.
 * Copyright (c) 2024-2026 Andrei Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
 *
 * JavaStartSamples is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

package com.github.merzsh;

import java.lang.reflect.Method;

import java.util.*;
import java.util.concurrent.*;
import java.util.regex.PatternSyntaxException;

import java.time.*;
import java.time.format.*;

import java.io.*;

import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;
//import javax.persistence.spi.PersistenceUnitTransactionType;

import java.net.URL;

import java.beans.PropertyEditorSupport;
import java.util.stream.IntStream;
import java.util.stream.Collectors;

import jakarta.persistence.*;
import jakarta.persistence.criteria.*;
import jakarta.persistence.spi.PersistenceUnitInfo;
import jakarta.persistence.spi.PersistenceUnitTransactionType;
import jakarta.persistence.spi.ClassTransformer;
//import jakarta.persistence.spi.HibernatePersistenceProvider;

import org.hibernate.*;
import org.hibernate.cfg.*;
import org.hibernate.jpa.*;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.support.MethodReplacer;
import org.springframework.cache.annotation.EnableCaching;
//import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.Primary;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcDaoSupport;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
//import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.orm.hibernate5.HibernateExceptionTranslator;
import org.springframework.orm.hibernate5.HibernateTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Pointcut;

import javax.cache.Caching;
import javax.cache.spi.CachingProvider;

import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.ehcache.config.units.EntryUnit;
import org.ehcache.config.builders.ExpiryPolicyBuilder;
import org.ehcache.jsr107.Eh107Configuration;
import org.springframework.cache.CacheManager;
import org.springframework.cache.jcache.JCacheCacheManager;

/*
  Венгерская нотация префиксов имен переменных.
  Шаблон имени: <видимость><вид_переменной><тип_данных><имя_еременной>
  Пример имени: mviSomeData, palSomeArrayData, lrsSomeString, lroDate, SOME_VAL (константа)

  Видимость: m - поле класса; p - параметр метода, l - локальная переменная
  Вид переменной: v - переменная примитивного типа, a - массив, r - ссылка на объект, 
  Тип данных: i - int (или первые буквы примитивных типов), s - тип String, o - объект
 */
public class JavaStartSamples {

  public static class ClassA {
  }

  public static class ClassB extends ClassA {
  }

  // This prog starts with main() method call ... )
  public static void main(String[] args) {
    System.out.println("********************************************************************");
    System.out.println("Hello, it's Java dummy samples! Привет, это простейшие примеры Java!");
    System.out.println("********************************************************************");
    System.out.println("Выберите № одного из примеров для просмотра:");
    System.out.println("[0] - Выход");
    System.out.println("[1] - Продвинутая обработка строк в Unicode");
    System.out.println("[2] - Форматирование строк");
    System.out.println("[3] - Числа, символы, строки");
    System.out.println("[4] - Массивы");
    System.out.println("[5] - Битовые операции");
    System.out.println("[6] - Параметры командной строки (сортировка)");
    System.out.println("[7] - Календарь");
    System.out.println("[8] - Генератор случайного числа");
    System.out.println("[9] - Консольная графика");
    System.out.println("[10]- Наследование (instanceof)");
    System.out.println("[11]- JDBC: простой SQL-запрос с параметром (СУБД PostgreSQL, здесь и далее )");
    System.out.println("[12]- Потоки");
    System.out.println("[13]- Hibernate (базовый пример)");
    System.out.println("[14]- Hibernate JPA (опция 13 через JPA)");
    System.out.println("[15]- Spring Framework: внедрение зависимостей (DI) и аспекты (AOP)");
    System.out.println("[16]- Spring Framework: доступ к данным через JDBC");
    System.out.println("[17]- Spring Framework: доступ к данным через Hibernate/JPA");
    System.out.println("[18]- Клонирование объектов");
    System.out.println();

    // Константы метода (слово 'static' добавляется при объявлении на уровне класса)
    final String STR_TRY_AGAIN = "Try again ([0] - Exit).";
    final String STR_BYE_BYE = "Bye-bye, hope 2cU again! :)";

    int i;

    try {
      Scanner scan = new Scanner(System.in);
      i = scan.nextInt();
    } catch(InputMismatchException ex) {
      System.out.println("Input error, exact number expected! " + STR_TRY_AGAIN);
      System.exit(-1);
      return;
    }

		/*
		Scanner sc = new Scanner (System.in);
		StringBuilder buf = new StringBuilder();
		System.out.println();
		System.out.print("aaa");
		buf.append(sc.next());
		System.out.print("bbb");
		// sc.next() будет считывать следующее слово до символа перевода строки и можно использовать hasNext();
		// т.е. при вводе 2 слова данный next() не запросит ввод, но запросит если ввести 1 слово затем Enter
		// другими словами, next() и его коллеги работает в пределах одной строки, а nextLine() по строкам :)
		buf.append(sc.next());
		System.out.println(new String(buf));
		*/

    System.out.println();
    // В switch допускается указывать типы: byte, char, short, int, enum, String
    switch(i) {
      case 0:
        System.out.println("Exiting ... " + STR_BYE_BYE);
        break;
      case 1:
        processUnicodeString();
        break;
      case 2:
        formatString();
        break;
      case 3:
        numbersCharsStrings();
        break;
      case 4:
        arrays();
        break;
      case 5:
        // @SupressWarnings("fallthrough") - какая-то ошибка, непонятно
        // данная аннотация подавляет предупрежд. компилятора о сквозном проваливании (при отсутствии break)
        bitOperations();
        break;
      case 6:
        commandPromptParams(args);
        break;
      case 7:
        curMonthCalendar();
        break;
      case 8:
        randomize();
        break;
      case 9:
        consoleGraphics();
        break;
      case 10:
        checkInstanceof();
        break;
      case 11:
        checkSimpleSQL();
        break;
      case 12:
        checkThreads();
        break;
      case 13:
        checkHibernate();
        break;
      case 14:
        checkHibernateJPA();
        break;
      case 15:
        checkSpringFrameworkViaXmlConfig();
        break;
      case 16:
        checkSpringFrameworkDataAccessJDBC();
        break;
      case 17:
        checkSpringFrameworkDataAccessHibJpa();
        break;
      case 18:
        checkObjectsCloning();
        break;
      default:
        System.out.println("***> Unsupported operation, exiting! <***");
        System.exit(-1);
    }

    System.out.println();
    System.out.println("***> Operation completed successfully! " + STR_BYE_BYE + " <***");
  }

  /**
   * Метод выводящий строку бит числа указанного типа.
   * Метод составлен в функциональном стиле, т.е.:
   * - все переменные присваиваются только в момент инициализации
   * - все счетчики заменены через лямбда-выражения Stream API
   * - каждый вложенный блок кода рассматривает переменный как final (неизменяемые), наподобие поведения лямбд
   * - код вложенного блока потоконезависимый (не мутабельный и не допускает побочных эффектов)
   * Возможные значения aType:
   * 'i' - int, возврат строки с 32 битами;
   * 'b' - byte, возврат строки с 8 битами;
   */
  public static String asBinaryString(final int aValue, final char aType) {
    if(!(aType == 'b' || aType == 'i')) return "Unknown type: '" + aType + "'!";

    // Обе переменные строго final. Больше никаких изменений!
    final int size = (aType == 'i') ? 32 : 8;

    // Генерируем поток индексов от 0 до size-1 (слева направо, как пишется строка)
    return IntStream.range(0, size)
      .mapToObj(index -> {
        // 1. Проверяем, нужен ли дефис на этой позиции (индексы теперь идут слева направо: 8, 17, 26)
        if(aType == 'i' && (index == 8 || index == 17 || index == 26)) {
          return "-";
        }

        // 2. Магия вычисления конкретного бита:
        // Выясняем, какой именно бит числа aValue соответствует текущему индексу строки.
        // Так как строка идет слева направо, старшие биты будут в начале.
        // Математически учитываем сдвиг из-за дефисов, которые стоят перед текущим индексом.
        final int cDelimiterOffset = (aType == 'i') ? (index > 26 ? 3 : (index > 17 ? 2 : (index > 8 ? 1 : 0))) : 0;

        // Индекс бита в самом числе (от 31 до 0 для 'i', от 7 до 0 для 'b')
        final int bitShift = (size - 1) - (index - cDelimiterOffset);

        // Проверяем конкретный бит с помощью маски без изменения aValue
        return ((aValue >>> bitShift) & 1) == 1 ? "1" : "0";
      })
      // Собираем все строковые элементы ("0", "1", "-") в одну итоговую строку
      .collect(Collectors.joining());
  }

  public static void processUnicodeString() {
    System.out.println("========== Unicode string processing advanced sample ... done =========");
		/* Кодировка Unicode содержит одну базовую кодовую плоскость для европейских алфавитов и
			 дополнительные 15 плоскостей для азиатских иероглифов.

			 Элементарный символ алфавита (буква или часть иероглифа) отображаемый Unicode называется
			 кодовой точкой. Соответственно, каждой кодовой точке базовой плоскости (т.е. букве или другому
			 графическому символу) соответствует 2 байта типа char или одной кодовой единице,
			 а каждой кодовой точке дополнительной плоскости (т.е. иероглифу / доп. спец-символу)
			 соответствует 4 байта типа int или пара из двух байтов char (двух кодовых единиц).

			 В случае дополнительной кодовой плоскости, первые 2 байта пары (первая из двух кодовых единиц)
			 кодируются значениями в диапазоне от U+D800 до U+DBFF, а вторые 2 байта пары (вторая из двух
			 кодовых единиц) кодируются значениями в диапазоне от U+DC00 до U+DFFF кодов основной плоскости.

			 Следовательно, данное обстоятельство необходимо учитывать при обработке строк в Java и
			 использовать методы обращающиеся к символам строки на уровне char только тогда,
			 когда можно гарантировать отсутствие произвольного ввода пользователя, например при обработке
			 строго определенного стиля текста вроде свойств или заранее подготовленных текстов.

			 Ниже приводится пример обработки смешенной строки, содержащей символы из основной и
			 дополнительной кодовой плоскостей:
			 U+1D546  - матем. символ "Множество октонионов" в виде буквы 'O' представлен двумя кодовыми единицами:
			 U+D835 и U+DD46
		*/

    char[] a_char = {
      // Математический символ "Множество октонионов" в виде буквы 'O' из доп. кодовой плоскости;
      // занимает 2 кодовые единицы (2 char):
      '\uD835', '\uDD46',
      // Спец-символ 'тм' из основной кодовой плоскости, занимает 1 кодовую единицу (1 char):
      '™'
    };

    String str = new String(a_char);  // конструируем из массива строку
    // выводим результат на консоль, наблюдаем спец. символы из разных плоскостей
    System.out.println("String with exotic chars from non-base codespace: " + str);

    // При больших количествах и объемах строк эффективнее пользоваться классом StringBuilder
    // (или менее эффективным, но потокобезопасным StringBuffer)
    //
    // В данном примере добавляем кодовую точку U+1F37A дополнительной кодовой плоскости (иероглиф "кружка")
    // через StringBuilder, т.к. нам не известны составляющие ее кодовые единицы:
    StringBuilder sb = new StringBuilder();
    for(int i = 0; i < str.codePointCount(0, str.length()); i++) {
      sb.appendCodePoint(str.codePointAt(str.offsetByCodePoints(0, i)));
    }

    // добавим в буфер иероглиф "кружка":
    sb.appendCodePoint(0x1F37A);

    // Пересоздаем строку с иероглифом в конце:
    str = new String(sb);

    int[] a_points = str.codePoints().toArray();
    for(int i : a_points) System.out.print(i + " ");

    // В выводе видно, что реальное число букв и длина массива отличаются
    // поэтому в данном случае использование метода String.charAt(i) может привести к ошибке, т.к.
    // часть 4 байтовой кодовой точки не может быть верно интерпретирована.
    System.out.println("<- char codes; string content & letters count/array length: " + str + " & " +
      str.codePointCount(0, str.length()) + "/" + str.length());

    // При необходимости посимвольного перебора в смешанных строках, можно использовать
    // методы класса Character для диагностики.
    // В качестве примера выведем кодовую точку (букву), состоящую из одной кодовой единицы:
    // Примечание: возможно, лучшим и более удобным решенем будет обработка массива int через выражение
    // str.CodePoints().toArray()
    System.out.println(">>>");
    for(int i = 0; i < str.length(); i++) {
      if(Character.isSurrogate(str.charAt(i))) {
        System.out.println("Char i=" + i + " is from another codespace (surrogate)!");
        continue;
      } else {
        System.out.println("Found char from base codespase: " + str.charAt(i));
      }
    }

    // Другой вид перебора более крупными шагами (при движении от головы к хвосту строки),
    // но с использованием 4 байтового кода (пары кодовых едениц):
    System.out.println(">>>");
    for(int i = 0; i < str.length(); ) {
      if(Character.isSupplementaryCodePoint(str.codePointAt(i))) {
        System.out.println("Char starts with i=" + i + " is from another codespace (surrogate)!");
        i += 2;
      } else {
        System.out.println("Found char from base codespace: " + str.charAt(i));
        i++;
      }
    }

    System.out.println("========== Unicode string - end of processing - ==============");
  }

  public static void formatString() {
    //double f = 10/3;
    // Примечание: %1$, %2$ и тд - явное указание номера параметра к формату и выводу;
    // %< - новое форматирование и вывод предыдущего обрабатываемого параметра
    // %tx - ключ устарел, для форматирования даты/времени надо пользоваться методами пакета java.time

    System.out.printf("Formatting by System.out.printf(): %s %d %.2f %x; today is %td.%<tm.%<tY %<tT",
      "string", 10, (double) 100 / 3, 255, new Date());
    System.out.println();
    System.out.printf(
      "Formatting by String.format(): %s %d %.2f %x; today is %td.%<tm.%<tY %<tT%n",
      "string", 10, (double) 100 / 3, 255, new Date());
    System.out.println();
  }

  public static void numbersCharsStrings() {
    // целочисленные значения
    int num = 100 * 2;  // динамическая инициализация арифметическим выражением
    System.out.println("This is var 'num' with value: " + num);

    // вывод целочисленного литерала в разных форматах
    num = 0b1010;
    System.out.print("Бинарный литерал '0b1010': " + num + "; ");
    num = 0xFF;
    System.out.println("Шестнадцатиричный литерал '0xFF': " + num);
    num = 123_456;
    System.out.print("Десятичный литерал '123_456', разделенный подчеркиванием: " + num);
    System.out.println();

    // Конструкция "Простое условие":
    //if(num != 200) {
    // int num = 7;   // ошибка, нельзя заводить одноименную локальную и видимую извне переменную!
    System.out.println("Вы увидите это :)");
    //} else System.out.println("Вы НЕ увидите это :(");

    // Конструкция "Цикл":
    for(int i = 0; i < 3; i++) {
      System.out.println("Итерация №: " + i);
    }

    // дробные числа (с плавающей точкой); Вывод: 5.1
    double fl = 3.5, al = 1.6;
    System.out.println("Плавающее число: " + (fl + al));

    float ff = 123.45f;  // по-умолчанию, в Java тип 'double', поэтому явно указывается суффикс 'F'

    // преобразование числа с плавающей точкой к целому (на прямое присвоение выдается ошибка)
    num = (int) ff;
    System.out.println("Преобразованное в целое плавающее число '123.45': " + num);

    // символы
    char ch1 = 113, ch2 = 'Y';
    System.out.println("Символы: ch1='" + ch1 + "' и ch2='" + ch2 + "' :)");
    ch1++;
    System.out.println("Теперь символ ch1='" + ch1 + "' - увеличение кода на 1");

    // логические символы
    boolean b = false;
    if(!b) System.out.println("Это логическое значение равно: " + b);
  }

  public static void arrays() {
    // Массивы
    // 1. Простой пример с целыми числами
    int[] a_int = {0, 1, 2};

    System.out.print("Массив [0,1,2], ");

    System.out.print("знач.тек.яч./сч.: ");
    for(int i = 0; i < a_int.length; i++) {
      System.out.print(a_int[i] + "/" + i + ", ");
    }
    System.out.println();

    // 2. Продвинутый пример с дробными (поиск среднего значения 5 элементов)
    // и итератором типа for...each
    double[] d_nums = {10.1, 11.2, 12.3, 13.4, 14.5};
    double f_result = 0;
    for(double item : d_nums) f_result += item;
    d_nums = Arrays.copyOf(d_nums, d_nums.length + 3);

    // При копировании массива новые элементы заполняются нулями если длина нового массива больше,
    // а если меньше, то копируются только первые элементы по длине нового массива (что влезет, то влезет :)
    System.out.println("Содержимое увеличенного на 3 элемента массива дробных чисел 'd_nums': " + Arrays.toString(d_nums));
    System.out.println("Среднее плавающее по массиву 'd_nums' (только значащие элементы): " + f_result / 5);

    // 3. Продвинутый пример с двумерным массивом
    int[][] ai_2d = {{11, 12, 13}, {21, 22, 23}};
    System.out.println("Распечатка многомерного массива размерностью 2 методом Arrays.deepToString(array):");
    System.out.println(Arrays.deepToString(ai_2d));
    System.out.println("Распечатка двумерного массива циклами for...each:");

    for(int[] row : ai_2d) {
      for(int col : row) {
        System.out.print(col + " ");
      }
      System.out.println();
    }

    // 4. Продвинутый пример с многомерными массивами
    char[][][] ai_3d = {
      {{'A', 'B'}, {'C', 'D'}},
      {{'E', 'F'}, {'G', 'H'}},
      {{'I', 'J'}, {'K', 'L'}}
    };

    System.out.println("Распечатка многомерного массива размерностью 3 методом Arrays.deepToString(array):");
    System.out.println(Arrays.deepToString(ai_3d));
    System.out.println("Распечатка многомерного массива размерностью 3 циклами по i, j k:");

    for(int i = 0; i < ai_3d.length; i++) {
      for(int j = 0; j < ai_3d[i].length; j++)
        for(int k = 0; k < ai_3d[i][j].length; k++)
          System.out.print(ai_3d[i][j][k] + " ");
      System.out.println();
    }

    // 5. Инкремент префикс/суффикс
    System.out.println("Pre & post Increment samples (n1 = n2 = 1):");

    int n1 = 1, n2 = 1;
    System.out.println("n1 (pre-inc): " + (++n1) + ", n2 (post-inc): " + (n2++));
    System.out.println("n2 ++:" + n2);
  }

  // @SupressWarnings("fallthrough") - какая-то ошибка, непонятно ...
  public static void bitOperations() {
    System.out.println("===== Пример битовых вычислений: =====");
    System.out.println("Маскирование на 3 и 4 биты: 123 | 0b00011000");
    System.out.println(asBinaryString(77, 'b'));
    System.out.println(asBinaryString(0b00011000, 'b'));
    System.out.println("--------");

    // если в результате '&' получим исходную маску, то 3 и 4 биты установлены
    System.out.println(asBinaryString(77 & 0b00011000, 'b'));
    System.out.println("Сдвиг влево на 2 разряда = умножение на 4: 1024 * 4 = 4096");
    System.out.println(asBinaryString(1024, 'i'));

    // Сначала ядро Java приводит операнд к типу int, а потом уже все сдвигает!
    System.out.println(asBinaryString(1024 << 2, 'i'));
  }

  public static void commandPromptParams(String[] pasArgs) {
    String err = "Параметры командной строки не заданы, останов!";
    Objects.requireNonNull(pasArgs, err); // генерирует NullPointerExcaption если аргумент равен null

    if(pasArgs.length == 0) {
      System.out.println(err);
      return;
    }

    System.out.println("Введены следующие параметры командной строки: " + Arrays.toString(pasArgs));
    Arrays.sort(pasArgs);

    System.out.println("Сортировка параметров в прямом порядке: " + Arrays.toString(pasArgs));

    Arrays.sort(pasArgs, Comparator.reverseOrder());
    System.out.println("Сортировка параметров в обратном порядке: " + Arrays.toString(pasArgs));
  }

  public static void curMonthCalendar() {
    LocalDate lroDate = LocalDate.now();
    Locale lroLoc = null;
    String lrsMonth;
    StringBuilder lrsPadding = new StringBuilder();
    int lviDayOfWeekFor1st;

    for(Locale l : Locale.getAvailableLocales()) {
      if(l.getCountry().equalsIgnoreCase("ru") && l.getLanguage().equalsIgnoreCase("ru")) {
        //System.out.println(loc.getDisplayName() + " - " + loc.getDisplayLanguage() + " - " +
        // 		   loc.getCountry() + "_" + loc.getLanguage());
        lroLoc = l;
        break;
      }
    }

    lrsMonth = lroLoc == null ? String.valueOf(lroDate.getMonth().getValue()) :
      lroDate.getMonth().getDisplayName(TextStyle.FULL, lroLoc);
    System.out.println("Вывод календаря месяца " + lrsMonth + " " + lroDate.getYear() + " года:");
    System.out.println(" Пн Вт Ср Чт Пт Сб Вс");

    // узнаем день недели для первого числа месяца, чтобы настроить правильный отступ
    if(lroDate.getDayOfMonth() == 1) lviDayOfWeekFor1st = lroDate.getDayOfWeek().getValue();
    else lviDayOfWeekFor1st = lroDate.minusDays(lroDate.getDayOfMonth() - 1).getDayOfWeek().getValue();

    if(lviDayOfWeekFor1st == 1) lrsPadding = new StringBuilder(" "); // если понедельник
    else {
      lrsPadding.append("   ".repeat(Math.max(0, lviDayOfWeekFor1st - 1)));
    }

    // печатаем отступ
    System.out.print(lrsPadding);

    for(int i = 1, j = lviDayOfWeekFor1st; i <= lroDate.lengthOfMonth(); i++, j++) {
      if(i == lroDate.getDayOfMonth()) System.out.printf("[%2d]", i);
      else {
        if(i - 1 != lroDate.getDayOfMonth()) System.out.print(" ");
        System.out.printf("%2d", i);
      }

      if(j == 7) {
        System.out.println();
        j = 0;
      }
    }

    //Date dt = LocalDate.now();
  }

  public static void randomize() {
    double lvdGenNum = Math.random();

    String lrsMsg = "Генерация случайного числа:";
    System.out.println(lrsMsg);
    System.out.println("1) в инервале [0...1] через java.lang.Math.random(): " + lvdGenNum);
    System.out.printf("     приведение к целочисленному интервалу [0...100]: %.2f", lvdGenNum * 100);
    System.out.println();
    System.out.print("2) в интервале [0...100] через java.util.Random.nextInt(): ");
    System.out.printf("%d", new Random().nextInt(100));
    System.out.println();
  }

  public static void consoleGraphics() {
    char c = 0x2801;

    // System.out.print("\u001B[31m");
    System.out.print("\033[0;91m"); // выбрать цвет
    for(int i = 0; i < 20; i++) {
      System.out.print(c);
      System.out.println(i);
      c++;
    }

    //System.out.print("\u001B[0m");
    System.out.print("\033[0m"); // сбросить цвет
  }

  public static void checkInstanceof() {
    Object clsb = new ClassB();

    if(clsb instanceof ClassA) System.out.println("Yes, ClassB object is instance of ClassA!");
    if(clsb instanceof ClassB) System.out.println("Yes, ClassB object is instance of ClassB!");

    if(clsb instanceof String) System.out.println("Yes, ClassB object is instance of String class!");
    else System.out.println("No, ClassB object is not instance of String class!");

    clsb = "";
    System.out.println(clsb.getClass().getName());
  }

  private static class FiboThread implements Runnable {
    private final String mvsTaskName;
    private final long mviLen;
    private final BlockingQueue<Long> mrcQueue;
    private final CountDownLatch mrcLatch;

    public FiboThread(String pvsTaskName, long pviLen, BlockingQueue<Long> prcQueue, CountDownLatch prcLatch) {
      if(pvsTaskName == null) throw new NullPointerException("pvsTaskName");
      if(prcQueue == null) throw new NullPointerException("prcQueue");
      if(prcLatch == null) throw new NullPointerException("prcLatch");

      mviLen = pviLen;
      mrcQueue = prcQueue;
      mrcLatch = prcLatch;
      mvsTaskName = pvsTaskName;
    }

    public void run() {
      try {
        long fi = fibonachi(mviLen);
        mrcQueue.offer(fi);

        System.out.println("Task '" + mvsTaskName + "' has done!");

        mrcLatch.countDown();
        Thread.sleep(1);
      } catch(InterruptedException ex) {
        System.out.println("Thread '" + Thread.currentThread().getName() + "' was inrerrupted ...");
      }
    }
  }

  private static class PubThread implements Runnable {
    private final BlockingQueue<Long> mrcQueue;
    private final CountDownLatch mrcLatch;
    private final Exchanger<Boolean> mrcExchanger;

    public PubThread(BlockingQueue<Long> prcQueue, CountDownLatch prcLatch, Exchanger<Boolean> prcExchanger) {
      if(prcQueue == null) throw new NullPointerException("prcQueue");
      if(prcLatch == null) throw new NullPointerException("prcLatch");
      if(prcExchanger == null) throw new NullPointerException("prcExchanger");

      mrcQueue = prcQueue;
      mrcLatch = prcLatch;
      mrcExchanger = prcExchanger;
    }

    public void run() {
      try {
        mrcLatch.await();
        long result = 0, lvlElem = 0;

        while(true) {
          try {
            lvlElem = mrcQueue.remove();
            result += lvlElem;
            System.out.println("Current fibo: " + lvlElem + " / Sum fibo: " + result);
          } catch(NoSuchElementException ex) {
            System.out.println("Blocking queue was processed sucessfully");
            mrcExchanger.exchange(null);
            return;
          }
        }
        //Thread.sleep(1);
      } catch(InterruptedException ex) {
        System.out.println("Thread '" + Thread.currentThread().getName() + "' was inrerrupted ...");
      }
    }
  }

  private static class FiboRecurseThread implements Callable<Long> {
    private final ExecutorService mrcExec;
    private final int mviFrom;
    private final int mviTo;
    private final int mviThreadNum;

    public FiboRecurseThread(ExecutorService prcExec, int pviFrom, int pviTo, int pviThreadNum) {
      if(prcExec == null) throw new NullPointerException("prcExec");
      if(pviFrom < 0 || pviTo < 0 || pviThreadNum < 0) throw new IllegalArgumentException();

      mrcExec = prcExec;
      mviFrom = pviFrom;
      mviTo = pviTo;
      mviThreadNum = pviThreadNum;
    }

    public Long call() {
      try {
        //System.out.println("Recurse task num: " + mviThreadNum);
        int INT_THRESHOLD = 10;
        if(mviTo - mviFrom <= INT_THRESHOLD) {
          return fibonachi(mviTo);
        } else {
          int num1 = mviThreadNum + 1;
          int num2 = mviThreadNum + 2;
          return mrcExec.submit(new FiboRecurseThread(mrcExec, mviFrom, mviTo - 1, num1)).get() +
            mrcExec.submit(new FiboRecurseThread(mrcExec, mviFrom, mviTo - 2, num2)).get();
        }
      } catch(InterruptedException | ExecutionException ex) {
        System.out.println("Thread '" + Thread.currentThread().getName() + "' was inrerrupted ...");
      }
      return null;
    }
  }

  public static long fibonachi(long n) {
    if(n < 0) throw new IllegalArgumentException("'N' must not be negative!");
    else if(n == 0 || n == 1) return n;
    else return fibonachi(n - 1) + fibonachi(n - 2);
  }

  private static class SearchRecurseThread implements Callable<Integer> {
    private final ExecutorService mrcExec;
    private final List<String> mriList;
    private final String mvsSearchWord;
    private final int mviFrom;
    private final int mviTo;
    private final int mviThreadNum;

    public SearchRecurseThread(ExecutorService prcExec, List<String> priList, String pvsSearchWord,
                               int pviFrom, int pviTo, int pviThreadNum) {
      if(prcExec == null) throw new NullPointerException("prcExec");
      if(priList == null) throw new NullPointerException("prcExec");
      if(pvsSearchWord == null) throw new NullPointerException("pvsSearchWord");
      if(pviFrom < 0 || pviTo < 0 || pviThreadNum < 0) throw new IllegalArgumentException();

      mrcExec = prcExec;
      mriList = priList;
      mvsSearchWord = pvsSearchWord;
      mviFrom = pviFrom;
      mviTo = pviTo;
      mviThreadNum = pviThreadNum;
    }

    public Integer call() {
      try {
        //System.out.println("Recurse task num: " + mviThreadNum);
        int INT_THRESHOLD = 5000;
        if(mviTo - mviFrom <= INT_THRESHOLD) {
          for(int i = mviFrom; i < mviTo; i++) if(mriList.get(i).equals(mvsSearchWord)) return i;
          return -1;
        } else {
          int lviMid = (mviFrom + mviTo) / 2;

          Callable<Integer> lriTask1 = new SearchRecurseThread(mrcExec, mriList, mvsSearchWord, mviFrom, lviMid, mviThreadNum);
          Future<Integer> lriFuture1 = mrcExec.submit(lriTask1);

          Callable<Integer> lriTask2 = new SearchRecurseThread(mrcExec, mriList, mvsSearchWord, lviMid, mviTo, mviThreadNum);
          Future<Integer> lriFuture2 = mrcExec.submit(lriTask2);

          Integer result = lriFuture1.get();

          if(result == -1) {
            result = lriFuture2.get();
          }
          return result;
          // mrcExec.submit( new FiboRecurseThread(mrcExec, mviFrom, mviTo-1, num1) ).get() +
          // mrcExec.submit( new FiboRecurseThread(mrcExec, mviFrom, mviTo-2, num2) ).get();
        }
      } catch(InterruptedException | ExecutionException ex) {
        System.out.println("Thread '" + Thread.currentThread().getName() + "' was inrerrupted ...");
      }
      return null;
    }
  }

  public static void checkThreads() {
    int lviFiboLen = 20;
    int lviNumCPU = Runtime.getRuntime().availableProcessors();
    System.out.println("Total CPU cores in system detected: " + lviNumCPU);

    ExecutorService es = Executors.newFixedThreadPool(lviNumCPU);
    BlockingQueue<Long> queue = new ArrayBlockingQueue<Long>(lviNumCPU * 10);

    var lrcLatch = new CountDownLatch(lviNumCPU);
    var lrcExchanger = new Exchanger<Boolean>();
    Long result;

    long startTime = System.nanoTime();
    for(int i = 0; i < lviNumCPU; i++) {
      lviFiboLen = 25 + Math.round(Double.valueOf(Math.random()).floatValue() * 10);
      es.execute(new FiboThread("T" + i, lviFiboLen, queue, lrcLatch));
    }
    es.execute(new PubThread(queue, lrcLatch, lrcExchanger));

    //Boolean lvbFlag = Boolean.valueOf(false);
    try {
      //lvbFlag = lrcExchanger.exchange(null);
      lrcExchanger.exchange(null);
    } catch(InterruptedException ex) {
      System.out.println("Thread result exchange operation was interrupted!");
    }

    //System.out.println( fibonachi(42) );
    // waiting for calculations
    //lrcLatch.await();
    long finishTime = System.nanoTime() - startTime;
    double finishFormattedTime = finishTime / 1000000000.0;
    System.out.printf("%.3f sec%n", finishFormattedTime);
    es.shutdown();

    es = Executors.newCachedThreadPool();
    System.out.println();
    System.out.println("Started recursive multithreading of FIBO ...");
    lviFiboLen = 25;
    startTime = System.nanoTime();
    Future<Long> lrcFuture = es.submit(new FiboRecurseThread(es, 0, lviFiboLen, 1));

    try {
      System.out.println("Awaiting future result ...");
      result = lrcFuture.get();
      System.out.println("Recurse FIBO result is: " + result);
    } catch(InterruptedException | ExecutionException ex) {
      System.out.println("Thread calculation result failed!");
    }

    //System.out.println( fibonachi(43) );
    finishTime = System.nanoTime() - startTime;
    finishFormattedTime = finishTime / 1000000000.0;
    System.out.printf("%.3f sec%n", finishFormattedTime);
    System.out.println("Natural FIBO result is: " + fibonachi(lviFiboLen));
    es.shutdown();

    // WORD SEARCHING
    System.out.println();
    System.out.println("Search for text via brutaforce with threads - list building ...");

    int lviLen = 200000;
    List<String> lriList = new ArrayList<String>(lviLen);

    for(int i = 0; i < lviLen; i++) lriList.add(Integer.toString(i));

    lriList = new LinkedList<String>(lriList);
    System.out.println("Word list was prepared.");
    System.out.println();

    System.out.println("Single thread searching ...");
    String lvsSearchWord = Integer.valueOf(lviLen - 1).toString();

    startTime = System.nanoTime();
    for(int i = 0; i < lviLen; i++) {
      if(lriList.get(i).equals(lvsSearchWord)) {
        System.out.println("The word was found in position " + i);
        break;
      }
    }

    finishTime = System.nanoTime() - startTime;
    finishFormattedTime = finishTime / 1000000000.0;

    System.out.printf("Search was completed with %.3f sec%n", finishFormattedTime);
    System.out.println();
    System.out.println("Multiple thread searching ...");

    startTime = System.nanoTime();
    es = Executors.newCachedThreadPool();
    Callable<Integer> lriTask = new SearchRecurseThread(es, lriList, lvsSearchWord, 0, lviLen, 1);
    Future<Integer> lriFuture = es.submit(lriTask);
    int res;

    try {
      res = lriFuture.get();
    } catch(InterruptedException | ExecutionException ex) {
      System.out.println("The word wasm't found - execution error! Message:" + ex.getMessage());
      ex.printStackTrace();
      return;
    } finally {
      es.shutdown();
    }

    if(res >= 0) System.out.println("The word was found in position " + res);
    else if(res == -1) System.out.println("The word wasn't found!");
    else System.out.println("Erroneous position number: " + res);

    finishTime = System.nanoTime() - startTime;
    finishFormattedTime = finishTime / 1000000000.0;
    System.out.printf("Search was completed with %.3f sec%n", finishFormattedTime);

    //System.out.println(Math.round(Math.random()*10));
  }

  public static void checkSimpleSQL() {
    String STR_DB_DRIVER = "org.postgresql.Driver";
    String STR_DB_URL = "jdbc:postgresql://localhost:5432/javadb";
    String STR_DB_USERNAME = "javauser"; //"javauser";
    String STR_DB_USERPASS = "javapass"; //"";

    System.out.println("Hi, there! It's Test.java :)");
    //System.setProperty("jdbc.drivers", STR_DB_DRIVER);

    String sql = "select id, name from dummy t", sql_where = "where t.id = ?";

    try(Connection conn = DriverManager.getConnection(STR_DB_URL, STR_DB_USERNAME, STR_DB_USERPASS)) {
      try(Statement st = conn.createStatement()) {
        try(ResultSet rs = st.executeQuery(sql)) {
          while(rs.next()) {
            System.out.println(rs.getString("id") + " - " + rs.getString("name"));
          }
        }
      }

      // run SQL-query with parameter
      sql += " " + sql_where;
      try(PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setInt(1, 3);

        try(ResultSet rs = ps.executeQuery()) {
          System.out.println();
          System.out.println("Selection with parameter (ID=3):");
          while(rs.next()) {
            System.out.println(rs.getString("id") + " - " + rs.getString("name"));
          }
        }
      }

      //else System.out.println("Result set is empty!");
    } catch(SQLException ex) {
      ex.printStackTrace();
    }
  }

  /**
   * Dynamic JPA (Hybernate) configuration in Java-code (no any XML is required).
   */
  private static class PersistenceUnitInfoImpl implements PersistenceUnitInfo {
    Properties mrcProps;

    public PersistenceUnitInfoImpl() {
      String lvsPrefixHib = "hibernate.";
      String lvsPrefixCon = "connection.";
      mrcProps = new Properties();

      mrcProps.put(lvsPrefixHib + lvsPrefixCon + "driver_class", "org.postgresql.Driver");
      mrcProps.put(lvsPrefixHib + lvsPrefixCon + "url", "jdbc:postgresql:javadb");
      mrcProps.put(lvsPrefixHib + lvsPrefixCon + "username", "javauser");
      mrcProps.put(lvsPrefixHib + lvsPrefixCon + "password", "javapass");
      mrcProps.put(lvsPrefixHib + "default_schema", "public");
      mrcProps.put(lvsPrefixHib + "hbm2ddl.auto", "update");
      mrcProps.put(lvsPrefixHib + "show_sql", "true");
      mrcProps.put(lvsPrefixHib + "format_sql", "true");
      mrcProps.put(lvsPrefixHib + "use_sql_comments", "true");
    }

    @Override
    public Properties getProperties() {
      return mrcProps;
    }

    @Override
    public List<String> getManagedClassNames() {
      return Arrays.asList(User.class.getName(), Car.class.getName());
    }

    @Override
    public String getPersistenceUnitName() {
      return "Dummy";
    }

    @Override
    public String getPersistenceProviderClassName() {
      return HibernatePersistenceProvider.class.getName();
    }

    @Override
    public PersistenceUnitTransactionType getTransactionType() {
      return null;
    }

    @Override
    public DataSource getJtaDataSource() {
      return null;
    }

    @Override
    public DataSource getNonJtaDataSource() {
      return null;
    }

    @Override
    public List<String> getMappingFileNames() {
      return null;
    }

    @Override
    public List<URL> getJarFileUrls() {
      return null;
    }

    @Override
    public URL getPersistenceUnitRootUrl() {
      return null;
    }

    @Override
    public boolean excludeUnlistedClasses() {
      return false;
    }

    @Override
    public SharedCacheMode getSharedCacheMode() {
      return null;
    }

    @Override
    public ValidationMode getValidationMode() {
      return null;
    }

    @Override
    public String getPersistenceXMLSchemaVersion() {
      return null;
    }

    @Override
    public ClassLoader getClassLoader() {
      return null;
    }

    @Override
    public void addTransformer(ClassTransformer transformer) {
    }

    @Override
    public ClassLoader getNewTempClassLoader() {
      return null;
    }
  }

  private static class HibSessionFactory {
    private static SessionFactory mriSessionFactory;
    private static EntityManagerFactory mriEntityManFactory;

    private HibSessionFactory() {
    }

    public static SessionFactory buildSessionFactory() throws HibernateException {
      if(mriSessionFactory == null) {
        // can be configured through 'hibernate.cfg.xml' external file also

        mriSessionFactory = new org.hibernate.cfg.Configuration()
            .addAnnotatedClass(User.class)
            .addAnnotatedClass(Car.class)

            // Новые Jakarta JPA константы взамен устаревших
            .setProperty(AvailableSettings.JAKARTA_JDBC_DRIVER, "org.postgresql.Driver")
            .setProperty(AvailableSettings.JAKARTA_JDBC_URL, "jdbc:postgresql://localhost:5432/javadb")
            .setProperty(AvailableSettings.JAKARTA_JDBC_USER, "javauser")
            .setProperty(AvailableSettings.JAKARTA_JDBC_PASSWORD, "javapass")

            /*
            // Устаревшие константы
            .setProperty(AvailableSettings.DRIVER, "org.postgresql.Driver")
            .setProperty(AvailableSettings.URL, "jdbc:postgresql://localhost:5432/javadb")
            .setProperty(AvailableSettings.USER, "javauser")
            .setProperty(AvailableSettings.PASS, "javapass")
            */

            //.setProperty(AvailableSettings.DIALECT, "PostgreSQL9Dialect")
            .setProperty(AvailableSettings.DEFAULT_SCHEMA, "public")
            .setProperty(AvailableSettings.SHOW_SQL, "true")
            .setProperty(AvailableSettings.FORMAT_SQL, "true")
            .setProperty(AvailableSettings.USE_SQL_COMMENTS, "true")

            // table auto creation (or update if exists) when SessionFactory creates
            .setProperty(AvailableSettings.HBM2DDL_AUTO, "update") // updates (creates if not exists)
            /*
            .setProperty(AvailableSettings.HBM2DDL_AUTO, "create") // recreates tables with data
            .setProperty(AvailableSettings.HBM2DDL_AUTO, "create-drop") // creates and drops finally
            .setProperty(AvailableSettings.HBM2DDL_AUTO, "none") // no any changes (equals omittion)
            .setProperty(AvailableSettings.HBM2DDL_AUTO, "validate") // throws exception if no tab
            */
        .buildSessionFactory();
      }
      return mriSessionFactory;
    }

    public static void closeSessionFactory() throws HibernateException {
      if(mriSessionFactory == null) return;
      mriSessionFactory.close();
      mriSessionFactory = null;
    }

    public static EntityManagerFactory buildEntityManagerFactory() {
      if(mriEntityManFactory == null) {
        PersistenceUnitInfo lriPUI = new PersistenceUnitInfoImpl();
        var prov = new HibernatePersistenceProvider();
        mriEntityManFactory = prov.createContainerEntityManagerFactory(lriPUI, Collections.EMPTY_MAP);
      }

      return mriEntityManFactory;
    }

    public static void closeEntityManagerFactory() {
      if(mriEntityManFactory == null) return;
      mriEntityManFactory.close();
      mriEntityManFactory = null;
    }
  }

  @Entity
  @Table(name = "dummy_users_dyn")
  private static class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true)
    private int id;
    private String name;
    private int age;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    //@Fetch(FetchMode.JOIN) - not works, use Root.fetch() method instead to generate JOINed SQL

    private List<Car> cars;

    public User() {
      cars = new ArrayList<>();
    }

    public int getId() {
      return id;
    }

    public String getName() {
      return name;
    }

    public void setName(String pName) {
      name = pName;
    }

    public int getAge() {
      return age;
    }

    public void setAge(int pAge) {
      age = pAge;
    }

    public void addCar(Car pvcCar) {
      pvcCar.setUser(this);
      cars.add(pvcCar);
    }

    public void removeCar(Car pvcCar) {
      pvcCar.setUser(null);
      cars.remove(pvcCar);
    }

    public List<Car> getCars() {
      return cars;
    }

    public void setCars(List<Car> priCars) {
      cars = priCars;
    }

    @Override
    public String toString() {
      return String.format("User{id=%d, name='%s'}", id, name);
    }
  }

  @Entity
  @Table(name = "dummy_cars_dyn")
  private static class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true)
    private int id;

    @Column(nullable = false)
    private String model;

    @Column(name = "colour", nullable = false)
    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false /*, referencedColumnName="bookId"*/)
    private User user;

    public Car() {
    }

    public int getId() {
      return id;
    }

    public String getModel() {
      return model;
    }

    public void setModel(String pModel) {
      model = pModel;
    }

    public String getColor() {
      return color;
    }

    public void setColor(String pColor) {
      color = pColor;
    }

    public User getUser() {
      return user;
    }

    public void setUser(User pUser) {
      user = pUser;
    }

    @Override
    public String toString() {
      return String.format("Car{id=%d, model='%s', color='%s', user_id='%d'}", id, model, color, user.getId());
    }
  }

  private static class SelectionView {
    private final int mviUserId;
    private final String mvsUserName;
    private final int mviCarId;
    private final String mvsCarModel;

    public SelectionView(int pviUserId, String pvsUserName, int pviCarId, String pvsCarModel) {
      mviUserId = pviUserId;
      mvsUserName = pvsUserName;
      mviCarId = pviCarId;
      mvsCarModel = pvsCarModel;
    }

    public int getUserId() {
      return mviUserId;
    }

    public String getUserName() {
      return mvsUserName;
    }

    public int getCarId() {
      return mviCarId;
    }

    public String getCarModel() {
      return mvsCarModel;
    }

    @Override
    public String toString() {
      return String.format("SelectionView{UserId='%d', UserName='%s', CarId='%d', CarModel='%s'}",
        mviUserId, mvsUserName, mviCarId, mvsCarModel);
    }
  }

  private static interface IDataProvider extends AutoCloseable {
    public CriteriaBuilder getCriteriaBuilder();

    public <T> TypedQuery<T> runQuery(CriteriaQuery<T> priCriteriaQuery);

    public <T> TypedQuery<T> runQuery(String pvsQueryHQL, Class<T> pvcResultType);

    public void startTransaction();

    public void commitTransaction();

    public void rollbackTransaction();

    public <T> T findById(Class<T> prcSearchedEntityClass, Object pviId);

    public EntityManager getConnection();

    public EntityManager getCurrentConnection();

    public void openConnection();

    public void closeConnection();
  }

  private static abstract class DataProvider implements IDataProvider {
    protected EntityManagerFactory mriFactory;
    protected EntityManager mriConnection;
    protected EntityTransaction mriTransaction;

    protected void checkInstance() {
      Objects.requireNonNull(mriFactory, this.getClass().getName() + ".mriFactory");
      Objects.requireNonNull(mriConnection, this.getClass().getName() + ".mriConnection");
    }

    public DataProvider() {
    }

    @Override
    public CriteriaBuilder getCriteriaBuilder() {
      checkInstance();
      return mriConnection.getCriteriaBuilder();
    }

    @Override
    public <T> TypedQuery<T> runQuery(String pvsQueryHQL, Class<T> pvcResultType) {
      Objects.requireNonNull(pvsQueryHQL, "pvsQueryHQL");
      Objects.requireNonNull(pvcResultType, "pvcResultType");
      checkInstance();

      return mriConnection.createQuery(pvsQueryHQL, pvcResultType);
    }

    @Override
    public <T> TypedQuery<T> runQuery(CriteriaQuery<T> priCriteriaQuery) {
      Objects.requireNonNull(priCriteriaQuery, "priCriteriaQuery");
      checkInstance();

      return mriConnection.createQuery(priCriteriaQuery);
    }

    @Override
    public void startTransaction() {
      closeConnection();
      openConnection();
      checkInstance();

      mriTransaction = mriConnection.getTransaction();
      mriTransaction.begin();
    }

    @Override
    public void commitTransaction() {
      checkInstance();

      mriTransaction.commit();
      closeConnection();
    }

    @Override
    public void rollbackTransaction() {
      //checkInstance();
      if(mriTransaction != null) mriTransaction.rollback();
      closeConnection();
    }

    @Override
    public <T> T findById(Class<T> prcSearchedEntityClass, Object pviId) {
      checkInstance();
      return mriConnection.find(prcSearchedEntityClass, pviId);
    }

    @Override
    public EntityManager getConnection() {
      return mriConnection;
    }

    @Override
    public void closeConnection() {
      // close connection & set it to null
      if(mriConnection != null) mriConnection.close();
      mriConnection = null;
    }

    @Override
    public void close() throws Exception {
      mriFactory = null;
      mriConnection = null;
    }
  }

  private static class DataProviderJPA extends DataProvider {
    public DataProviderJPA() {
      super();
      mriFactory = HibSessionFactory.buildEntityManagerFactory();

      // test connection once for first time
      openConnection();
      checkInstance();
      closeConnection();
    }

    @Override
    public void openConnection() {
      mriConnection = mriFactory.createEntityManager();
      checkInstance();
    }

    @Override
    public EntityManager getCurrentConnection() {
      //checkInstance();
      return mriFactory.createEntityManager();
    }

    @Override
    public void close() throws Exception {
      super.close();
      HibSessionFactory.closeEntityManagerFactory();
    }
  }

  private static class DataProviderHibSpec extends DataProvider {
    private static final String MSG_SESSION_CAST_ERROR = "mriConnection member is not Session class instance, error!";

    public DataProviderHibSpec() {
      super();
    }

    @Override
    public void startTransaction() {
      closeConnection();
      openConnection();
      checkInstance();

      Session s = null;

      try {
        s = (Session) mriConnection;
      } catch(ClassCastException ex) {
        throw new IllegalStateException(MSG_SESSION_CAST_ERROR, ex);
      }

      mriTransaction = s.beginTransaction();
    }

    @Override
    public <T> T findById(Class<T> prcSearchedEntityClass, Object pviId) {
      checkInstance();

      Session s = null;

      try {
        s = (Session) mriConnection;
      } catch(ClassCastException ex) {
        throw new IllegalStateException(MSG_SESSION_CAST_ERROR, ex);
      }

      return s.get(prcSearchedEntityClass, pviId);
    }

    @Override
    public void openConnection() {
      mriConnection = ((SessionFactory) mriFactory).openSession();
      checkInstance();
    }

    @Override
    public EntityManager getCurrentConnection() {
      //checkInstance();
      return ((SessionFactory) mriFactory).getCurrentSession();
    }
  }

  private static class DataProviderHib extends DataProviderHibSpec {
    public DataProviderHib() {
      super();
      mriFactory = HibSessionFactory.buildSessionFactory();

      openConnection();
      checkInstance();
      closeConnection();
    }

    @Override
    public void close() throws Exception {
      super.close();
      HibSessionFactory.closeSessionFactory();
    }
  }

  private static interface IDaoLayer {
    public void setDataProvider(IDataProvider priDataProvider);

    public IDataProvider getDataProvider();

    public <T> long countAll(Class<T> prcType);

    public <T> List<T> selectAll(Class<T> prcType);

    public User getUserByID(int pviID);

    public List<SelectionView> selectUserViewCriteria(int pviAge, String pvsColor);

    public List<SelectionView> selectUserViewHQL(int pviAge, String pvsColor);

    public void insertUser(User prcUser);

    public void updateUser(User prcUser);

    public void deleteUser(User prcUser);

    public Car getCarByID(int pviID);

    public void insertCar(Car prcCar);

    public String checkCache();

    public void insertUserWithSpringHibAnnotatedTransaction(User prcUser);

    public void insertCarWithSpringHibAnnotatedTransaction(Car prcCar);

    public void insertUserWithSpringJpaAnnotatedTransaction(User prcUser);

    public void insertCarWithSpringJpaAnnotatedTransaction(Car prcCar);
  }

  @Repository
  private static class DaoLayer implements IDaoLayer {
    private IDataProvider mriDataProvider;

    protected void checkInstance() {
      Objects.requireNonNull(mriDataProvider, this.getClass().getName() + ".mriDataProvider");
    }

    // Dummy constructor to avoid ambiguous (2 data providers, Hib & Jpa) autowired.
    // Single constructor marks as autowired by default
    public DaoLayer() {
    }

    //@Autowired
    public DaoLayer(IDataProvider priDataProvider) {
      Objects.requireNonNull(priDataProvider, "priDataProvider");

      mriDataProvider = priDataProvider;
      checkInstance();
    }

    @Override
    public IDataProvider getDataProvider() {
      checkInstance();
      return mriDataProvider;
    }

    @Override
    public void setDataProvider(IDataProvider priDataProvider) {
      Objects.requireNonNull(priDataProvider, "priDataProvider");

      mriDataProvider = priDataProvider;
      checkInstance();
    }

    public <T> long countAll(Class<T> prcType) {
      Objects.requireNonNull(prcType, "prcType");
      checkInstance();

      Long result = null;

      try {
        mriDataProvider.openConnection();

        CriteriaBuilder cb = mriDataProvider.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<T> root = query.from(prcType);
        query.select(cb.count(root));

        result = mriDataProvider.runQuery(query).getSingleResult();
      } finally {
        mriDataProvider.closeConnection();
      }

      return result;
    }

    public <T> List<T> selectAll(Class<T> prcType) {
      Objects.requireNonNull(prcType, "prcType");
      checkInstance();

      List<T> result = null;

      try {
        mriDataProvider.openConnection();

        CriteriaBuilder cb = mriDataProvider.getCriteriaBuilder();
        CriteriaQuery<T> query = cb.createQuery(prcType);
        Root<T> root = query.from(prcType);
        root.fetch("cars");
        query.select(root);

        result = mriDataProvider.runQuery(query).getResultList();
      } finally {
        mriDataProvider.closeConnection();
      }

      return result;
    }

    public User getUserByID(int pviID) {
      if(pviID <= 0) throw new IllegalArgumentException("pviID<0");
      checkInstance();

      User result = null;

      try {
        mriDataProvider.openConnection();
        result = mriDataProvider.findById(User.class, pviID);
      } finally {
        mriDataProvider.closeConnection();
      }

      return result;
    }

    public List<SelectionView> selectUserViewCriteria(int pviAge, String pvsColor) {
      checkInstance();
      List<SelectionView> result = null;

      try {
        mriDataProvider.openConnection();

        CriteriaBuilder cb = mriDataProvider.getCriteriaBuilder();
        CriteriaQuery<SelectionView> query = cb.createQuery(SelectionView.class);
        Root<User> root = query.from(User.class);
        //root.fetch("cars");
        query = query.multiselect(root.get("id"), root.get("name"),
          root.get("cars").get("id"), root.get("cars").get("model"));

        if(pviAge >= 0) {
          query = query.where(cb.lt(root.get("age"), pviAge));
        }
        if(pvsColor != null) {
          query = query.where(cb.equal(root.get("cars").get("color"), pvsColor));
        }

        result = mriDataProvider.runQuery(query).getResultList();
      } finally {
        mriDataProvider.closeConnection();
      }

      return result;
    }

    public List<SelectionView> selectUserViewHQL(int pviAge, String pvsColor) {
      checkInstance();
      List<SelectionView> result = null;

      try {
        mriDataProvider.openConnection();

        String lvsHQL = "SELECT NEW com.github.merzsh.JavaStartSamples$SelectionView(u.id, u.name, c.id, c.model) " +
          "FROM JavaStartSamples$User u INNER JOIN u.cars c " +
          "WHERE u.age < :p_age AND c.color like :p_color";

        TypedQuery<SelectionView> query = mriDataProvider.runQuery(lvsHQL, SelectionView.class);

        if(pviAge >= 0) {
          query.setParameter("p_age", pviAge);
        } else {
          query.setParameter("p_age", 1000);
        }

        query.setParameter("p_color", Objects.requireNonNullElse(pvsColor, "%"));

        result = query.getResultList();
      } finally {
        mriDataProvider.closeConnection();
      }

      return result;
    }

    private static enum CRUD {CREATE, UPDATE, DELETE}

    private void operateUserInDb(User prcUser, CRUD preCrudOp) {
      Objects.requireNonNull(prcUser, "prcUser");
      Objects.requireNonNull(preCrudOp, "preCrudOp");
      checkInstance();

      //EntityTransaction lriTx = null;
      try {
        //lriTx = mriDataProvider.startTransaction();
        mriDataProvider.startTransaction();
        EntityManager em = mriDataProvider.getConnection();
        Objects.requireNonNull(em, "mriDataProvider.getConnection()");

        switch(preCrudOp) {
          case CREATE:
            mriDataProvider.getConnection().persist(prcUser);
            break;
          case UPDATE:
            mriDataProvider.getConnection().merge(prcUser);
            break;
          case DELETE:
            mriDataProvider.getConnection().remove(em.contains(prcUser) ? prcUser :
              em.merge(prcUser));
            break;
          default:
            System.out.println("Unknown DB operation!");
        }

        mriDataProvider.commitTransaction();
        //lriTx.commit();
      } catch(Exception ex) {
        mriDataProvider.rollbackTransaction();
        ex.printStackTrace();

        //if(lriTx!=null) lriTx.rollback();
        String err = "Transactional modification operation '%s' was rollback due some error! Exiting ...";
        System.out.printf((err) + "%n", preCrudOp);
        throw ex;
      }
    }

    public void insertUser(User prcUser) {
      Objects.requireNonNull(prcUser, "prcUser");
      operateUserInDb(prcUser, CRUD.CREATE);
    }

    public void updateUser(User prcUser) {
      Objects.requireNonNull(prcUser, "prcUser");
      operateUserInDb(prcUser, CRUD.UPDATE);
    }

    public void deleteUser(User prcUser) {
      Objects.requireNonNull(prcUser, "prcUser");
      operateUserInDb(prcUser, CRUD.DELETE);
    }

    public Car getCarByID(int pviID) {
      if(pviID <= 0) throw new IllegalArgumentException("pviID<0");
      checkInstance();

      Car result = null;
      try {
        mriDataProvider.openConnection();
        result = mriDataProvider.findById(Car.class, pviID);
      } finally {
        mriDataProvider.closeConnection();
      }

      return result;
    }

    public void insertCar(Car prcCar) {
      Objects.requireNonNull(prcCar, "prcCar");
      checkInstance();

      try {
        mriDataProvider.startTransaction();
        mriDataProvider.getConnection().persist(prcCar);
        mriDataProvider.commitTransaction();
      } catch(Exception ex) {
        mriDataProvider.rollbackTransaction();
        ex.printStackTrace();
        throw ex;
      }
    }

    //@Cacheable("__DEFAULT__")
    @Cacheable("my_cache")
    @Override
    public String checkCache() {
      return "CACHED VALUE: " + Double.toString(Math.round(Math.random() * 100));
    }

    @Transactional(transactionManager = "hibtm", readOnly = false, propagation = Propagation.MANDATORY)
    @Override
    public void insertUserWithSpringHibAnnotatedTransaction(User prcUser) {
      Objects.requireNonNull(prcUser, "prcUser");
      mriDataProvider.getCurrentConnection().persist(prcUser);
    }

    @Transactional(transactionManager = "hibtm", readOnly = false, propagation = Propagation.MANDATORY)
    @Override
    public void insertCarWithSpringHibAnnotatedTransaction(Car prcCar) {
      Objects.requireNonNull(prcCar, "prcCar");

      mriDataProvider.getCurrentConnection().persist(prcCar);
      //throw new NullPointerException();
    }

    @Transactional(transactionManager = "jpatm", readOnly = false, propagation = Propagation.MANDATORY)
    @Override
    public void insertUserWithSpringJpaAnnotatedTransaction(User prcUser) {
      Objects.requireNonNull(prcUser, "prcUser");

      mriDataProvider.getCurrentConnection().persist(prcUser);
    }

    @Transactional(transactionManager = "jpatm", readOnly = false, propagation = Propagation.MANDATORY)
    @Override
    public void insertCarWithSpringJpaAnnotatedTransaction(Car prcCar) {
      Objects.requireNonNull(prcCar, "prcCar");

      mriDataProvider.getCurrentConnection().persist(prcCar);
      //throw new NullPointerException();
    }
  }

  @Component
  private static class ServiceLayer {
    private final IDaoLayer mrcDao;

    @Autowired
    public ServiceLayer(IDaoLayer priDao) {
      Objects.requireNonNull(priDao, "priDao");

      mrcDao = priDao;
    }

    public long countUsers() {
      return mrcDao.countAll(User.class);
    }

    public List<User> selectAllUsers() {
      return mrcDao.selectAll(User.class);
    }

    public User findUser(int pviID) {
      return mrcDao.getUserByID(pviID);
    }

    public List<SelectionView> selectUsersUnderAge(int pviAge, boolean pvbIsHQL) {
      if(pvbIsHQL) return mrcDao.selectUserViewHQL(pviAge, null);
      else return mrcDao.selectUserViewCriteria(pviAge, null);
    }

    public List<SelectionView> selectUsersWithCarsColor(String pvsColor, boolean pvbIsHQL) {
      if(pvbIsHQL) return mrcDao.selectUserViewHQL(-1, pvsColor);
      else return mrcDao.selectUserViewCriteria(-1, pvsColor);
    }

    public void saveUser(User prcUser) {
      mrcDao.insertUser(prcUser);
    }

    public void updUser(User prcUser) {
      mrcDao.updateUser(prcUser);
    }

    public void delUser(User prcUser) {
      mrcDao.deleteUser(prcUser);
    }

    @Transactional(transactionManager = "hibtm", readOnly = false, propagation = Propagation.REQUIRED)
    public void insertUserCarWithSpringHibAnnotatedTransaction(User prcUser, Car prcCar) {
      Objects.requireNonNull(prcUser, "prcUser");
      Objects.requireNonNull(prcCar, "prcCar");

      mrcDao.insertUserWithSpringHibAnnotatedTransaction(prcUser);

      prcCar.setUser(prcUser);
      prcUser.addCar(prcCar);

      mrcDao.insertCarWithSpringHibAnnotatedTransaction(prcCar);

			/*
			try {
				mrcDao.getDataProvider().openConnection();
				mrcDao.insertUserWithSpringHibAnnotatedTransaction(prcUser);
			} finally {
				mrcDao.getDataProvider().closeConnection();
			}
			*/
    }

    @Transactional(transactionManager = "jpatm", readOnly = false, propagation = Propagation.REQUIRED)
    public void insertUserCarWithSpringJpaAnnotatedTransaction(User prcUser, Car prcCar) {
      Objects.requireNonNull(prcUser, "prcUser");
      Objects.requireNonNull(prcCar, "prcCar");

      mrcDao.insertUserWithSpringJpaAnnotatedTransaction(prcUser);

      prcCar.setUser(prcUser);
      prcUser.addCar(prcCar);

      mrcDao.insertCarWithSpringJpaAnnotatedTransaction(prcCar);
    }
  }

  public static void hibernateScenario(ServiceLayer prcServiceLayer) {
    Objects.requireNonNull(prcServiceLayer, "prcServiceLayer");

    System.out.println("Start all users selection.");

    List<User> users = prcServiceLayer.selectAllUsers();
    System.out.println("All users was selected.");
    long cnt = prcServiceLayer.countUsers();
    User usr = null;
    Car car = null;

    // recreating database for testing purpose sample
    System.out.println("\n");
    System.out.println("HIBERNATE TESTING ...");
    System.out.printf("Users selection: %d records was loaded.%n", cnt);

    System.out.println("Existed user/car tree output:");
    for(User user : users) {
      //if(user.getId()==15){
      System.out.println(user.toString());
      for(Car crr : user.getCars()) {
        System.out.println(crr.toString());
      }
      //}
    }

    System.out.println("Output done. Start cleaning users & cars tables:");
    for(User user : users) {
      System.out.printf("Deleting user: %s%n", user.toString());
      prcServiceLayer.delUser(user);
    }

    usr = new User();
    usr.setName("Some Name");
    usr.setAge(19);

    car = new Car();
    car.setModel("Chevrolet");
    car.setColor("Black");
    car.setUser(usr);
    usr.addCar(car);

    prcServiceLayer.saveUser(usr);
    System.out.printf("New user created: %s%n", usr.toString());
    System.out.printf("New car added: %s%n", car.toString());

    usr = new User();
    usr.setName("Some Name");
    usr.setAge(25);

    car = new Car();
    car.setModel("Mazeratty");
    car.setColor("Green");
    car.setUser(usr);
    usr.addCar(car);

    Car crr = car;

    car = new Car();
    car.setModel("BMW");
    car.setColor("Red");
    car.setUser(usr);
    usr.addCar(car);

    prcServiceLayer.saveUser(usr);
    System.out.printf("New user created: %s%n", usr.toString());
    System.out.printf("New car added: %s%n", crr.toString());
    System.out.printf("New car added: %s%n", car.toString());

    usr = prcServiceLayer.findUser(usr.getId());
    usr.setName("Mister X");
    prcServiceLayer.updUser(usr);

    for(int i = 1; i <= 2; i++) {
      boolean lvbIsHQL = (i != 1);
      String lvsQueryForm = (lvbIsHQL ? "HQL" : "CriteriaAPI");
      System.out.printf("%d) Sending %s query ...%n", i, lvsQueryForm);

      System.out.println("Query SelectionView fields with ALL records ...");
      List<SelectionView> lv = prcServiceLayer.selectUsersUnderAge(-1, lvbIsHQL);
      System.out.println("Queried. Printing SelectionView records/fields:");

      for(SelectionView v : lv) System.out.println(v);

      System.out.println("Query SelectionView fields with records filtered by User age (lower '20') ...");
      lv = prcServiceLayer.selectUsersUnderAge(20, lvbIsHQL);
      System.out.println("Queried. Printing SelectionView records/fields:");

      for(SelectionView v : lv) System.out.println(v);

      System.out.println("Query SelectionView fields with records filtered by Car color (equal 'Red') ...");
      lv = prcServiceLayer.selectUsersWithCarsColor("Red", lvbIsHQL);
      System.out.println("Queried. Printing SelectionView records/fields:");

      for(SelectionView v : lv) System.out.println(v);
    }

    System.out.println("HIBERNATE SCENARIO DONE");
  }

  public static void checkHibernate() {
    System.out.println("Try using Hibernate data provider .....");

    try(IDataProvider lriDataProvider = new DataProviderHib()) {
      var dao = new DaoLayer(lriDataProvider);
      var srv = new ServiceLayer(dao);
      System.out.println("Data provider created.");
      hibernateScenario(srv);
    } catch(Exception ex) {
      ex.printStackTrace();
    }
  }

  public static void checkHibernateJPA() {
    System.out.println("Try using Hibernate JPA data provider .....");

    try(IDataProvider lriDataProvider = new DataProviderJPA()) {
      var dao = new DaoLayer(lriDataProvider);
      var srv = new ServiceLayer(dao);
      System.out.println("Data provider created.");
      hibernateScenario(srv);
    } catch(Exception ex) {
      ex.printStackTrace();
    }
  }

  public static interface ISomeConnection {
    public void connect();
  }

  public static class SomeConnection implements ISomeConnection {
    public SomeConnection() {
    }

    public void connect() {
      System.out.println("I'am some connection ... :)");
    }
  }

  public static class MiscConnection implements ISomeConnection {
    public MiscConnection() {
    }

    public void connect() {
      System.out.println("I'am misc connection ... :0");
    }
  }

  public static interface ITop {
    public TopClass getTopClass();
  }

  public static abstract class TopClass {
    public TopClass() {
    }

    @Override
    public abstract Object clone() throws CloneNotSupportedException;
  }

  public static interface IUser {
    public int getUserId();

    public void setUserId(int pviUserId);

    public String getUserName();

    public void setUserName(String pvsUserName);
  }

  public static class SomeUser extends TopClass implements IUser, ApplicationContextAware {
    private int mviUserId;
    private String mvsUserName;
    private ApplicationContext mriContext;

    public SomeUser(int pviUserId, String pvsUserName) {
      //Objects.requireNonNull(pviUserId, "pviUserId");
      Objects.requireNonNull(pvsUserName, "pvsUserName");

      mvsUserName = pvsUserName;
      mviUserId = pviUserId;
    }

    public void setApplicationContext(ApplicationContext context) {
      mriContext = context;
      //System.out.println("UsrNm:" + mvsUserName);
    }

    public ApplicationContext getApplicationContext() {
      return mriContext;
    }

    public void enrollEvent() {
      if(mriContext != null) {
        mriContext.publishEvent(new CustomEvent(this, new CustomEventArgs("SOME_EVNT_MSG")));
      }
    }

    public int getUserId() {
      return mviUserId;
    }

    public void setUserId(int pviUserId) {
      mviUserId = pviUserId;
    }

    public String getUserName() {
      if(mvsUserName == null) mvsUserName = "";
      return mvsUserName;
    }

    public void setUserName(String pvsUserName) {
      Objects.requireNonNull(pvsUserName, "pvsUserName");
      mvsUserName = pvsUserName;
    }

    @Override
    public boolean equals(Object otherObject) {
      if(otherObject == null || getClass() != otherObject.getClass()) return false;
      if(this == otherObject) return true;

      var obj = (SomeUser) otherObject;

      return Objects.equals(mviUserId, obj.getUserId()) &&
        Objects.equals(mvsUserName, obj.getUserName());
    }

    @Override
    public int hashCode() {
      return Objects.hash(mviUserId, mvsUserName);
    }

    public int hashCodeObj() {
      return super.hashCode();
    }

    @Override
    public String toString() {
      return String.format("User info: { UserID = '%d', UserName = '%s' }", mviUserId, mvsUserName);
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
      SomeUser result = new SomeUser(mviUserId, mvsUserName);
      result.setApplicationContext(mriContext);
      return result;
    }
  }

  public static class UserEditor extends PropertyEditorSupport {
    public UserEditor() {
    }

    public void setAsText(String textValue) {
      try {
        String[] res = textValue.split("~");
        if(res.length == 2) {
          // apply prepared object
          setValue(new SomeUser(Integer.parseInt(res[0]), res[1]));
        }
      } catch(PatternSyntaxException | NumberFormatException ex) {
        ex.printStackTrace();
      }
    }
  }

  public static class CustomEventArgs {
    public String STR = "";

    public CustomEventArgs(String arg) {
      STR = arg;
    }
  }

  public static class CustomEvent extends ApplicationEvent {
    CustomEventArgs mrcEventArgs;

    public CustomEvent(Object source, CustomEventArgs args) {
      super(source);
      mrcEventArgs = args;
    }

    public CustomEventArgs getEventArgs() {
      return mrcEventArgs == null ? new CustomEventArgs("") : mrcEventArgs;
    }
  }

  /**
   * Classic POJO interface + class complect :)
   */
  public interface IComputer {
    public String getVendor();

    public void setVendor(String pvsVendor);

    public String getSegment();

    public void setSegment(String pvsSegment);

    public String getHardware();

    public void setHardware(String pvsHardware);
  }

  public static class Computer extends TopClass implements IComputer, MethodReplacer, ApplicationListener {
    private String mvsVendor = "";
    private String mvsSegment = ""; // Workstation, Server, SDS (СХД)
    private String mvsHardware = ""; // HW configuration

    private void checkMembers() {
      Objects.requireNonNull(mvsVendor, "mvsVendor");
      Objects.requireNonNull(mvsSegment, "mvsSegment");
      Objects.requireNonNull(mvsHardware, "mvsHardware");
    }

    public Computer() {
      super();
    }

    public void perform() {
      System.out.println("Print some egregious stuff waz REDEFINED :)");
    }

    public String getVendor() {
      checkMembers();
      return mvsVendor;
    }

    public void setVendor(String pvsVendor) {
      Objects.requireNonNull(pvsVendor, "pvsVendor");
      mvsVendor = pvsVendor;
    }

    public String getSegment() {
      checkMembers();
      return mvsSegment;
    }

    public void setSegment(String pvsSegment) {
      Objects.requireNonNull(pvsSegment, "pvsSegment");
      mvsSegment = pvsSegment;
    }

    public String getHardware() {
      checkMembers();
      return mvsHardware;
    }

    public void setHardware(String pvsHardware) {
      Objects.requireNonNull(pvsHardware, "pvsHardware");
      mvsHardware = pvsHardware;
    }

    public void onApplicationEvent(ApplicationEvent event) {
      if(event instanceof CustomEvent ev) {
        String str = ev.getEventArgs().STR;
        System.out.printf("Class '%s' got event '%s'!%n", Computer.class, str);
      }
    }

    @Override
    public Object reimplement(Object target, Method method, Object[] args) {
      System.out.println("Print some egregious stuff waz REDEFINED :)");
      return "qqq";
    }

    @Override
    public boolean equals(Object otherObject) {
      if(otherObject == null || getClass() != otherObject.getClass()) return false;
      if(this == otherObject) return true;

      var obj = (Computer) otherObject;
      return Objects.equals(mvsVendor, obj.mvsVendor) && Objects.equals(mvsSegment, obj.mvsSegment) &&
        Objects.equals(mvsHardware, obj.mvsHardware);
    }

    @Override
    public int hashCode() {
      return Objects.hash(mvsVendor, mvsSegment, mvsHardware);
    }

    @Override
    public String toString() {
      return String.format("Computer info: { Vendor = '%s', Segment = '%s', HW config = '%s' }",
        mvsVendor, mvsSegment, mvsHardware);
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
      Computer result = new Computer();
      result.setVendor(mvsVendor);
      result.setSegment(mvsSegment);
      result.setHardware(mvsHardware);

      return result;
    }
  }

  public static interface ICalc extends ITop {
    public int evaluate(int pviArg1, int pviArg2, String pvsMathAction);
  }

  public static interface IDept extends ITop {
    public int getDeptId();

    public String getDeptName();

    public void setDeptName(String pvsDeptName);

    public IUser getManager();

    public void setManager(IUser mriManager);
  }

  public static class Dept extends TopClass implements IDept, ICalc {
    private final int mviDeptId;
    private String mvsDeptName;
    private IUser mriManager;

    public Dept(int pviDeptId) {
      super();
      mviDeptId = pviDeptId;
    }

    public int getDeptId() {
      return mviDeptId;
    }

    public String getDeptName() {
      return mvsDeptName;
    }

    public void setDeptName(String pvsDeptName) {
      Objects.requireNonNull(pvsDeptName, "pvsDeptName");
      mvsDeptName = pvsDeptName;
    }

    public IUser getManager() {
      if(mriManager == null) return null;
      else {
        try {
          return (IUser) ((TopClass) mriManager).clone();
        } catch(Exception ex) {
          ex.printStackTrace();
          return null;
        }
      }
    }

    public void setManager(IUser priManager) {
      Objects.requireNonNull(priManager, "priManager");

      try {
        mriManager = (IUser) ((TopClass) priManager).clone();
      } catch(Exception ex) {
        ex.printStackTrace();
      }
    }

    @Override
    public TopClass getTopClass() {
      return (TopClass) this;
    }

    @Override
    public int evaluate(int pviArg1, int pviArg2, String pvsMathAction) {
      //System.out.println("I'm an evaluate() method of Dept class!");

      int result = 0;

      switch(pvsMathAction) {
        case "+":
          result = pviArg1 + pviArg2;
          break;
        case "*":
          result = pviArg1 * pviArg2;
          break;
        default:
          String str = "Incorrect math action '%s' was passed in method %s. There are '+' and '*' supported only!";
          str = String.format(str, pvsMathAction, Dept.class.getSimpleName() + ".evaluate()");
          throw new IllegalArgumentException(str);
      }
      return result;
    }

    @Override
    public boolean equals(Object otherObject) {
      if(otherObject == null || getClass() != otherObject.getClass()) return false;
      else {
        if(this == otherObject) return true;
        else {
          IDept obj = (IDept) otherObject;
          return mviDeptId == obj.getDeptId() && Objects.equals(mvsDeptName, obj.getDeptName()) &&
            Objects.equals(mriManager, obj.getManager());
        }
      }
    }

    @Override
    public int hashCode() {
      return Objects.hash(mviDeptId, mvsDeptName, mriManager);
    }

    @Override
    public String toString() {
      String result = "Departmrnt info: { DeptId = '%d', DeptName = '%s', %s }";
      return String.format(result, mviDeptId, mvsDeptName, mriManager.toString());
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
      Dept result = new Dept(mviDeptId);
      result.setDeptName(mvsDeptName);
      if(mriManager != null) result.setManager((IUser) ((TopClass) mriManager).clone());

      return result;
    }
  }

  public static class SomeDao {
    private final ISomeConnection mriConn;
    private Set<IUser> mriUsersList;
    private Set<Integer> mriUsersId;
    private Set<IComputer> mriComputers;
    private IUser mriAdminUser;
    private String mvsSomeProperty;

    private <T> Set<T> makeListDeepCopy(Set<T> priSet, Class<T> priClass) {
      Objects.requireNonNull(priSet, "priSet");
      Objects.requireNonNull(priClass, "priClass");

      Set<T> result = new HashSet<T>();

      for(T t : priSet) {
        T nt = null;

        try {
          TopClass tc = (TopClass) t;
          Object o = tc.clone();
          nt = priClass.cast(o);
        } catch(Exception ex) {
          ex.printStackTrace();
          nt = t;
        }
        result.add(nt);
      }

      return result;
    }

    public SomeDao(ISomeConnection priConn) {
      Objects.requireNonNull(priConn, "priConn");

      mriConn = priConn;
    }

    public void perform() {
      mriConn.connect();
    }

    public Set<IUser> getUsersList() {
      return makeListDeepCopy(mriUsersList, IUser.class);
    }

    public void setUsersList(Set<IUser> priUsersList) {
      Objects.requireNonNull(priUsersList, "priUsersList");

      mriUsersList = makeListDeepCopy(priUsersList, IUser.class);
    }

    public Set<Integer> getUsersId() {
      Set<Integer> result = new HashSet<Integer>();

      if(mriUsersId != null) {
        for(Integer i : mriUsersId) result.add(Integer.valueOf(i.intValue()));
      }
      return result;
    }

    public IUser getAdminUser() {
      try {
        return (IUser) ((TopClass) mriAdminUser).clone();
      } catch(Exception ex) {
        ex.printStackTrace();
        return null;
      }
      //return mriAdminUser;
    }

    public void setAdminUser(IUser priAdminUser) {
      Objects.requireNonNull(priAdminUser, "priAdminUser");

      try {
        mriAdminUser = (IUser) ((TopClass) priAdminUser).clone();
      } catch(Exception ex) {
        ex.printStackTrace();
      }
      //mriAdminUser = priAdminUser;
    }

    public void setUsersId(Set<Integer> priUsersId) {
      Objects.requireNonNull(priUsersId, "priUsersId");

      Set<Integer> result = new HashSet<Integer>();

      for(Integer i : priUsersId) result.add(Integer.valueOf(i.intValue()));
      mriUsersId = result;
    }

    public Set<IComputer> getComputers() {
      return makeListDeepCopy(mriComputers, IComputer.class);
    }

    public void setComputers(Set<IComputer> priComp) {
      Objects.requireNonNull(priComp, "priComp");

      mriComputers = makeListDeepCopy(priComp, IComputer.class);
    }

    public String getSomeProperty() {
      return mvsSomeProperty == null ? "" : mvsSomeProperty;
    }

    public void setSomeProperty(String pvsSomeProperty) {
      Objects.requireNonNull(pvsSomeProperty, "pvsSomeProperty");

      mvsSomeProperty = pvsSomeProperty;
    }
  }

  @Configuration
  @EnableAspectJAutoProxy
  public static class AdditionalConfig {
    public AdditionalConfig() {
    }

    public IUser newMainBossInstance() {
      return new SomeUser(0, "I'm cool Bo$$ of main department!");
    }

    @Bean
    public IUser mainDeptBoss() {
      return newMainBossInstance();
    }

    @Bean
    //@Scope("prototype")
    public IDept mainDept() {
      Dept res = new Dept(1000);
      res.setDeptName("MAIN DEPT.");
      res.setManager(mainDeptBoss());
      return res;
    }

    @Bean
    public Set<IDept> depts() {
      Set<IDept> res = new HashSet<IDept>();

      Dept d = new Dept(1001);
      d.setDeptName("HR DEPT.");
      d.setManager(new SomeUser(1, "I'm HR dept cheef!"));
      res.add(d);

      d = new Dept(1002);
      d.setDeptName("IT DEPT.");
      d.setManager(new SomeUser(2, "I'm IT director!"));
      res.add(d);

      d = new Dept(1003);
      d.setDeptName("PROD DEPT.");
      d.setManager(new SomeUser(3, "I'm production cheef!"));
      res.add(d);

      return res;
    }
  }

  @Component
  public static class SomeComponent {
    @Autowired
    @Qualifier("mainDept")
    private IDept mriMainDept;

    @Autowired
    @Qualifier("depts")
    private Set<IDept> mriDepts;

    public SomeComponent() {
    }

    public IDept getMainDept() {
      try {
        TopClass t = mriMainDept.getTopClass();
        return (IDept) t.clone();
        //return (IDept)((TopClass) mriMainDept).clone();
      } catch(Exception ex) {
        ex.printStackTrace();
        return null;
      }
    }

    public Set<IDept> getDepts() {
      return mriDepts;
    }
  }

  public static class AspectLoggerViaXML {
    public AspectLoggerViaXML() {
    }

    public void logMethSimpleBegin() {
      System.out.println("BEGIN call to some method ...");
    }

    public void logMethSimpleEnd() {
      System.out.println("END call to some method ...");
    }

    public Object logMethAround(ProceedingJoinPoint joinpoint, int pviArg1, int pviArg2, String pvsMathAction) {
      try {
        String str = "---> BEGIN method with args: int '%d', int '%d', String '%s'";
        str = String.format(str, pviArg1, pviArg2, pvsMathAction);

        System.out.println(str);
        Object result = joinpoint.proceed();
        System.out.print("--->");
        logMethSimpleEnd();

        return result;
      } catch(Throwable ex) {
        System.out.println("ERROR in Around() method:");
        ex.printStackTrace();
        return 0;
      }
    }
  }

  @Aspect
  @Component
  public static class AspectSecurityViaAnnotations {
    private String mvsActCode;

    public AspectSecurityViaAnnotations() {
    }

    @Pointcut("execution(* dummy.Dummy$ICalc.evaluate(..))")
    public void pointcutCalc() {
    }

    public String getActCode() {
      return mvsActCode;
    }

    public void setActCode(String pvsActCode) {
      Objects.requireNonNull(pvsActCode, "pvsActCode");

      if(!(pvsActCode.equals("+") || pvsActCode.equals("*")))
        throw new IllegalArgumentException(String.format("Supported '+' and '*' math actions " +
          "only (current action is '%s')!", pvsActCode));
      mvsActCode = pvsActCode;
    }

    //"and args(pviArg1, pviArg2, pvsMathAction)"):
    //error "cant distinguish 2 primitives" (possible solution - make Integer args instead int args ...)
    @Around("pointcutCalc() && args(.., pvsMathAction)")
    public Object checkUserAuths(ProceedingJoinPoint joinpoint, String pvsMathAction) {
      try {
        Objects.requireNonNull(pvsMathAction, "pvsMathAction");
        Objects.requireNonNull(mvsActCode, "math  action 'mvsActCode' undefined");

        if(!pvsMathAction.equals(mvsActCode))
          throw new IllegalStateException(String.format("Unathorized operation was requested: '%s'", pvsMathAction));

        // all auth checks passed well, so call business method
        String str = "Security passed, run requested method with action '%s'";
        str = String.format(str, pvsMathAction);
        System.out.println(str);
        return joinpoint.proceed();
      } catch(Throwable ex) {
        System.out.println("ERROR in annotation Around() security check method:");
        ex.printStackTrace();
        return 0;
      }
    }
  }

  @Component("someCalc")
  public static class SomeCalc extends TopClass implements ICalc {
    @Override
    public int evaluate(int pviArg1, int pviArg2, String pvsMathAction) {
      return -1;
    }

    @Override
    public TopClass getTopClass() {
      return (TopClass) this;
    }

    @Override
    public Object clone() {
      return new Object();
    }
  }

  public static interface IAspectAux {
    public void someAuxMethod();
  }

  public static class AspectAux implements IAspectAux {
    public AspectAux() {
    }

    public void someAuxMethod() {
      System.out.println("I'm some aux method implemented in aux aspect implementation class :)");
    }
  }

  public static void checkSpringFrameworkViaXmlConfig() {
    try {
      ApplicationContext ctx = new ClassPathXmlApplicationContext("./src/dummy/dummy_spring.xml");

      // Use XML bean notationdefinition
      SomeDao dao = ctx.getBean(SomeDao.class);
      dao.perform();
      System.out.println("Print users full data:");
      for(IUser usr : dao.getUsersList()) {
        System.out.println(usr);
      }
      System.out.println("Print users Id Integer list:");

      for(Integer uid : dao.getUsersId()) {
        System.out.println(uid);
      }
      System.out.println("Print computers list:");

      for(IComputer comp : dao.getComputers()) {
        System.out.println(comp);
      }
      System.out.println("Print Admin user: " + dao.getAdminUser());

      SomeUser su = (SomeUser) dao.getUsersList().iterator().next();
      su.enrollEvent();

      System.out.println("Read file property value: some.property=" + dao.getSomeProperty());

      // Use annotation bean definition
      //IDept d = ctx.getBean("mainDept", IDept.class);
      SomeComponent sc = ctx.getBean(SomeComponent.class);
      System.out.println(sc.getMainDept());

      System.out.println("Read depts from component:");
      for(IDept dpt : sc.getDepts()) {
        System.out.println(dpt);
      }

      System.out.println("Read depts as separated bean:");
      Set s = ctx.getBean("depts", Set.class);

      for(Object ob : s) {
        if(ob instanceof IDept dpt) {
          System.out.println(dpt);
        }
      }

      System.out.printf("Read predefined IUser 'user_3' bean from XML context: %s%n", ctx.getBean("user_3", IUser.class));

      // Use XML aspects
      AspectSecurityViaAnnotations as = ctx.getBean(AspectSecurityViaAnnotations.class);
      as.setActCode("+");
      IDept md = ctx.getBean("mainDept", IDept.class);
      ICalc cl = (ICalc) md;
      System.out.println("Evaluation result: " + cl.evaluate(2, 3, "+"));
      System.out.println("Evaluation result: " + cl.evaluate(2, 3, "*"));
      System.out.println("Evaluation result: " + cl.evaluate(2, 3, "-"));

      // Use annotated aspects
	    /*ICalc cc = ctx.getBean("someCalc", ICalc.class);
	    SomeCalc scc = (SomeCalc) cc.getTopClass();
	    IAspectAux au = (IAspectAux) scc;*/
    } catch(BeansException ex) {
      System.out.println("Spring bean (XML) error, exiting!");
      ex.printStackTrace();
    } catch(Exception ex) {
      System.out.println("Spring bean unknown error, exiting!");
      ex.printStackTrace();
    }
  }

  @Configuration
  @EnableCaching
  @EnableTransactionManagement
  public static class SpringDataConfig {
    @Bean
    public DataSource jdbcds() {
      System.setProperty("jdbc.drivers", "org.postgresql.Driver");
      return new DriverManagerDataSource("jdbc:postgresql:javadb", "javauser", "postgres1");
    }

    @Bean
    public MySpringJdbcDao jdbcdao() {
      var result = new MySpringJdbcDao();
      result.setDataSource(jdbcds());

      return result;
    }

    // This bean enables Hibernate (ORM) exceptions translation via aspect proxies to Spring exceptions.
    // Option activates such behaviour for classes marked with @Repository annotations
    @Bean
    public PersistenceExceptionTranslationPostProcessor hibexproc() {
      return new PersistenceExceptionTranslationPostProcessor();
    }

    // Hibernate v5 requires this bean in adition with PersistenceExceptionTranslationPostProcessor bean
    @Bean
    public HibernateExceptionTranslator hibtranslator() {
      return new HibernateExceptionTranslator();
    }

    @Bean
    public SessionFactory hibfactory() {
      Properties pr = new Properties();
      pr.setProperty(AvailableSettings.DRIVER, "org.postgresql.Driver");
      pr.setProperty(AvailableSettings.URL, "jdbc:postgresql:javadb");
      pr.setProperty(AvailableSettings.DEFAULT_SCHEMA, "public");
      pr.setProperty(AvailableSettings.USER, "javauser");
      pr.setProperty(AvailableSettings.PASS, "");
      pr.setProperty(AvailableSettings.DIALECT, "org.hibernate.dialect.PostgreSQL10Dialect");
      pr.setProperty(AvailableSettings.SHOW_SQL, "true");
      pr.setProperty(AvailableSettings.FORMAT_SQL, "true");
      pr.setProperty(AvailableSettings.USE_SQL_COMMENTS, "true");
      pr.setProperty(AvailableSettings.HBM2DDL_AUTO, "none");
      //pr.setProperty(AvailableSettings.HBM2DDL_AUTO, "create"); // recreates tables with data

      var sf = new LocalSessionFactoryBean();
      sf.setPackagesToScan("dummy");
      sf.setAnnotatedClasses(User.class, Car.class);
      sf.setHibernateProperties(pr);
      sf.setDataSource(jdbcds());

      try {
        sf.afterPropertiesSet();
      } catch(IOException ex) {
        throw new RuntimeException(ex);
      }

      return sf.getObject();

			/*
			return new LocalSessionFactoryBuilder(jdbcds())
				.addAnnotatedClasses(User.class, Car.class)
				.setProperty(AvailableSettings.DRIVER, "org.postgresql.Driver")
				.setProperty(AvailableSettings.URL, "jdbc:postgresql:javadb")
				.setProperty(AvailableSettings.DEFAULT_SCHEMA, "public")
				.setProperty(AvailableSettings.USER, "javauser")
				.setProperty(AvailableSettings.PASS, "")
				//.setProperty(AvailableSettings.DIALECT, "PostgreSQL9Dialect")
				.setProperty(AvailableSettings.SHOW_SQL, "true")
				.setProperty(AvailableSettings.FORMAT_SQL, "true")
				.setProperty(AvailableSettings.USE_SQL_COMMENTS, "true")
				// table autocreation (or update if exists) when SessionFactory creates
				//.setProperty(AvailableSettings.HBM2DDL_AUTO, "create") // recreates tables with data
				//.setProperty(AvailableSettings.HBM2DDL_AUTO, "update") // updates (creates if not exists)
				//.setProperty(AvailableSettings.HBM2DDL_AUTO, "create-drop") // creates and drops finally
				.setProperty(AvailableSettings.HBM2DDL_AUTO, "none") // no any changes (equals omittion)
				//.setProperty(AvailableSettings.HBM2DDL_AUTO, "validate") // throws exception if no tab
				.buildSessionFactory();
			*/
    }

    @Bean
    @Primary
    public EntityManagerFactory jpafactory() {
      Properties pr = new Properties();

      pr.setProperty(AvailableSettings.DRIVER, "org.postgresql.Driver");
      pr.setProperty(AvailableSettings.URL, "jdbc:postgresql:javadb");
      pr.setProperty(AvailableSettings.DEFAULT_SCHEMA, "public");
      pr.setProperty(AvailableSettings.USER, "javauser");
      pr.setProperty(AvailableSettings.PASS, "");
      pr.setProperty(AvailableSettings.DIALECT, "org.hibernate.dialect.PostgreSQL10Dialect");
      pr.setProperty(AvailableSettings.SHOW_SQL, "true");
      pr.setProperty(AvailableSettings.FORMAT_SQL, "true");
      pr.setProperty(AvailableSettings.USE_SQL_COMMENTS, "true");
      pr.setProperty(AvailableSettings.HBM2DDL_AUTO, "none");
      //pr.setProperty(AvailableSettings.HBM2DDL_AUTO, "create"); // recreates tables with data

      var jva = new HibernateJpaVendorAdapter();
      jva.setDatabase(Database.POSTGRESQL);
      jva.setShowSql(true);
      jva.setGenerateDdl(false);
      jva.setDatabasePlatform("org.hibernate.dialect.PostgreSQL10Dialect");

      var f = new LocalContainerEntityManagerFactoryBean();
      f.setDataSource(jdbcds());
      f.setPackagesToScan("dummy");
      f.setJpaProperties(pr);
      f.setJpaVendorAdapter(jva);

      f.afterPropertiesSet();

      return f.getObject();
    }

    //@Bean("cache")
    @Bean
    public CacheManager cache() {
      // 1. Создаем конфигурацию кэша на базе Ehcache 3
      var orgEhcacheConfig = CacheConfigurationBuilder.newCacheConfigurationBuilder(
          Object.class, // Тип ключа
          Object.class, // Тип значения
          ResourcePoolsBuilder.newResourcePoolsBuilder()
            .heap(100, EntryUnit.ENTRIES) // Лимит 100 элементов в оперативной памяти (в heap)
        )
        // В Ehcache 3 политика Eviction настраивается автоматически (по умолчанию как раз LFU/LRU)
        // eternal(true) заменяется на бесконечный Expiry:
        .withExpiry(ExpiryPolicyBuilder.noExpiration())
        .build();

      // 2. Инициализируем стандартный JCache CacheManager под капотом
      CachingProvider provider = Caching.getCachingProvider();
      javax.cache.CacheManager jCacheManager = provider.getCacheManager();

      // 3. Регистрируем наш кэш в менеджере с помощью моста Eh107Configuration
      jCacheManager.createCache("my_cache", Eh107Configuration.fromEhcacheCacheConfiguration(orgEhcacheConfig));

      // 4. Оборачиваем JCache-менеджер в адаптер для Spring 6
      var result = new JCacheCacheManager();
      result.setCacheManager(jCacheManager);

      return result;
    }

    @Bean
    public HibernateTransactionManager hibtm() {
      var result = new HibernateTransactionManager();
      result.setSessionFactory(hibfactory());
      return result;
    }

    @Bean
    public JpaTransactionManager jpatm() {
      var result = new JpaTransactionManager();
      result.setEntityManagerFactory(jpafactory());
      return result;
    }
  }

  public static class ResultPojoDummy {
    private int mviId;
    private String mvsName;

    public ResultPojoDummy() {
    }

    public int getId() {
      return mviId;
    }

    public void setId(int pviId) {
      mviId = pviId;
    }

    public String getname() {
      return mvsName;
    }

    public void setName(String pvsName) {
      mvsName = pvsName;
    }

    @Override
    public String toString() {
      String result = "ResultPojoDummy contents: {mviId='%d', mvsName='%s'}";
      return String.format(result, mviId, mvsName);
    }
  }

  /*
    SimpleJdbcTemplate и SimpleJdbcDaoSupport устарели;
    Надо использовать с приставкой NamedParameter вместо Simple :)
   */
  public static class MySpringJdbcDao extends NamedParameterJdbcDaoSupport {
    private NamedParameterJdbcTemplate mrcTemplate;
    private static final String STR_SQL_SELECT = "select id, name from dummy t";

    RowMapper<ResultPojoDummy> mriRow = (ResultSet rs, int rn) -> {
      var res = new ResultPojoDummy();
      res.setId(rs.getInt("id"));
      res.setName(rs.getString("name"));
      return res;
    };

    public void checkMembers() {
      if(mrcTemplate == null) mrcTemplate = getNamedParameterJdbcTemplate();
    }

    public MySpringJdbcDao() {
    }

    public List<ResultPojoDummy> testSelect() {
      checkMembers();
      return mrcTemplate.query(STR_SQL_SELECT, mriRow);
    }

    public ResultPojoDummy testSelectSingle(int pviId) {
      if(pviId <= 0) {
        String arg_err = "Error: argument must be greater than 0! Current value '%d'";
        throw new IllegalArgumentException(String.format(arg_err, pviId));
      }
      checkMembers();

      String STR_SQL_SELECT_PARAM = STR_SQL_SELECT + " where t.id = :p_id";

      Map<String, Object> params = new HashMap<String, Object>();
      params.put("p_id", pviId);

      return mrcTemplate.queryForObject(STR_SQL_SELECT_PARAM, params, mriRow);
    }
  }

  public static void checkSpringFrameworkDataAccessJDBC() {
    try {
      ApplicationContext ctx = new ClassPathXmlApplicationContext("./src/dummy/dummy_spring.xml");

      // Use XML bean notationdefinition
      MySpringJdbcDao dao = ctx.getBean(MySpringJdbcDao.class);

      System.out.println("Printing result set w/o any params with Spring JDBC RowMapper:");
      for(ResultPojoDummy r : dao.testSelect()) {
        System.out.println(r);
      }

      System.out.println();
      System.out.println("Printing select single (by Id param) result set with Spring JDBC RowMapper:");
      System.out.println(dao.testSelectSingle(3));
    } catch(BeansException ex) {
      System.out.println("Spring bean (XML) error, exiting!");
      ex.printStackTrace();
    } catch(Exception ex) {
      System.out.println("Spring bean unknown error, exiting!");
      ex.printStackTrace();
    }
  }

  @Component("dataProviderHibSpring")
  private static class DataProviderHibSpring extends DataProviderHibSpec {
    @Autowired
    public DataProviderHibSpring(@Qualifier("hibfactory") SessionFactory priSessionFactory) {
      super();
      Objects.requireNonNull(priSessionFactory, "priSessionFactory");

      mriFactory = priSessionFactory;

      openConnection();
      checkInstance();
      closeConnection();
    }

    @Override
    public void close() throws Exception {
      super.close();
      //HibSessionFactory.closeSessionFactory();
    }
  }

  @Component("dataProviderJpaSpring")
  private static class DataProviderJpaSpring extends DataProvider {
    // works like getCurrentSession() to join trabsaction from several methods
    // managed by Spring container automatically when transaction annotation begin
    @PersistenceContext
    EntityManager mriTransactionalEntityManager;

    @Autowired
    public DataProviderJpaSpring(@Qualifier("jpafactory") EntityManagerFactory priEmFactory) {
      super();
      Objects.requireNonNull(priEmFactory, "priEmFactory");

      mriFactory = priEmFactory;
      //mriFactory = HibSessionFactory.buildEntityManagerFactory();

      // test connection once for first time
      openConnection();
      checkInstance();
      closeConnection();
    }

    @Override
    public void openConnection() {
      mriConnection = mriFactory.createEntityManager();
      checkInstance();
    }

    @Override
    public EntityManager getCurrentConnection() {
      Objects.requireNonNull(mriTransactionalEntityManager, "mriTransactionalEntityManager");

      return mriTransactionalEntityManager;
      //return null;
    }

    @Override
    public void close() throws Exception {
      super.close();
      //HibSessionFactory.closeEntityManagerFactory();
    }
  }

  public static void checkSpringFrameworkDataAccessHibJpa() {
    ApplicationContext ctx = new ClassPathXmlApplicationContext("./src/dummy/dummy_spring.xml");

    IDaoLayer dao = ctx.getBean(IDaoLayer.class);
    Objects.requireNonNull(dao, "Can't get Hib session, error! Exiting ...");

    //var srv = new ServiceLayer(dao); // commented such autowired
    ServiceLayer srv = ctx.getBean(ServiceLayer.class);

		/*
		ORM (Hibernate/JPA) -> Spring manual exception translation sample:
			var lsfb = new LocalSessionFactoryBean();
			var ex = new org.hibernate.exception.GenericJDBCException("qqq", new SQLException());
			DataAccessException dae = lsfb.translateExceptionIfPossible(ex);
			Objects.requireNonNull(dae, "Object 'dae' is null!");
			System.out.println("DAE CLASS NAME: " + dae.getClass().getName());
		*/

    User usr = null;
    Car car = null;

    System.out.println("\nTry using Spring Hibernate native data provider ............................");
    dao.setDataProvider(ctx.getBean("dataProviderHibSpring", IDataProvider.class));
    hibernateScenario(srv);

    // test pure Hibernate transaction manager with Spring transactions
    usr = new User();
    usr.setName("Mr. Vain");
    usr.setAge(27);

    car = new Car();
    car.setModel("Porsche Cayenne");
    car.setColor("Black");

    srv.insertUserCarWithSpringHibAnnotatedTransaction(usr, car);

    System.out.println("\nTry using Spring Hibernate JPA data provider ...............................");
    dao.setDataProvider(ctx.getBean("dataProviderJpaSpring", IDataProvider.class));
    hibernateScenario(srv);

    // test Hibernate-JPA transaction manager with Spring transactions
    usr = new User();
    usr.setName("Mr. Vain 2");
    usr.setAge(27);

    car = new Car();
    car.setModel("Porsche Cayenne 2");
    car.setColor("Black");

    srv.insertUserCarWithSpringJpaAnnotatedTransaction(usr, car);

    System.out.println(dao.checkCache());
    System.out.println(dao.checkCache());

    // This construction (free resource) is not required cause Session is the bean always in memory ...
    // Just needed for catch Spring exceptions only ...
			/*
			try( IDataProvider lriDataProv = new DataProviderHibSpring() ){
				System.out.println("Data provider created.");
				hibernateScenario(idp);
			} catch(Exception ex) {
				ex.printStackTrace();
	    }
	    */

    //System.out.println("\nTry using Spring Hibernate-JPA data provider .....");
    //EntityManagerFactory emf = ctx.getBean("jpafactory", EntityManagerFactory.class);
    //Objects.requireNonNull(emf, "emf");
  }

  public static interface ICloneable {
    //public Object clone() throws CloneNotSupportedException;
    public <T> T clone(Class<T> priClass) throws IllegalArgumentException;
  }

  public static interface ICloneA {
    public String getMemberA();

    public void setMemberA(String value);

    public ICloneB getMemberB();
  }

  public static class CloneA implements ICloneA, ICloneable {
    protected String memberA;
    protected ICloneB memberB;

    public CloneA(String pA, ICloneB pB) {
      Objects.requireNonNull(pA, "pA");
      Objects.requireNonNull(pB, "pB");

      memberA = pA;
      memberB = pB;
    }

    @Override
    public String getMemberA() {
      return memberA;
    }

    @Override
    public void setMemberA(String value) {
      Objects.requireNonNull(value, "value");
      memberA = value;
    }

    @Override
    public ICloneB getMemberB() {
      return memberB;
    }

    @Override
    public String toString() {
      String result = "CloneA object: {memberA='%s', memberB=[%s]}";
      return String.format(result, memberA, memberB);
    }

    @Override
    //public Object clone() throws CloneNotSupportedException {
    public <T> T clone(Class<T> priClass) throws IllegalArgumentException {
      try {
        // e.a. check base compliance with our class
        return priClass.cast(new CloneA(memberA, ((ICloneable) memberB).clone(ICloneB.class)));

        //return priClass.cast( super.clone() );
      } catch(ClassCastException ex) {
        throw new IllegalArgumentException(ex);
      }

      //return new CloneA( memberA, (CloneB) memberB.clone() );
    }
  }

  public static interface ICloneB {
    public String getMemberC();

    public void setMemberC(String value);
  }

  public static class CloneB implements ICloneB, ICloneable, Cloneable {
    protected String memberC;

    public CloneB(String pC) {
      Objects.requireNonNull(pC, "pC");
      memberC = pC;
    }

    @Override
    public String getMemberC() {
      return memberC;
    }

    @Override
    public void setMemberC(String value) {
      Objects.requireNonNull(value, "value");
      memberC = value;
    }

    @Override
    public String toString() {
      String result = "CloneB object: {memberC='%s'}";
      return String.format(result, memberC);
    }

    @Override
    //public Object clone() throws CloneNotSupportedException {
    public <T> T clone(Class<T> priClass) throws IllegalArgumentException {
      try {
        // check base compliance with our class
        return priClass.cast(super.clone());
      } catch(ClassCastException | CloneNotSupportedException ex) {
        throw new IllegalArgumentException(ex);
      }
      //return super.clone();
    }
  }

  public static void checkObjectsCloning() {
    try {
      ICloneA orig = new CloneA("qqq", new CloneB("www"));
      //ICloneable origc = (ICloneable)orig;

      ICloneA copy = ((ICloneable) orig).clone(ICloneA.class);
      //ICloneA copy = (ICloneA) ((ICloneable)orig).clone();

      //ICloneA copy = ICloneA(((ICloneable)orig).clone());
	    
	    /*CloneA orig = new CloneA("qqq", new CloneB("www"));
	      CloneA copy  = (CloneA) orig.clone();*/

      copy.setMemberA("eee");
      copy.getMemberB().setMemberC("rrr");

      System.out.println(orig);
      System.out.println(copy);

      //throw new CloneNotSupportedException();
    } catch(Exception ex) {
      ex.printStackTrace();
    }
  }
}
