<h1>Random Words</h1>
<table>
    <tr>
        <th>Id</th>
        <th>Word Content</th>
        <th>Difficulty</th>
    </tr>

    <!-- Here is where we loop through our $posts array, printing out post info -->
    <?phpecho $this->Session->flash(); ?>

    <?php foreach ($words as $word): ?>
    <tr>
        <td><?php echo $word['Word']['id']; ?></td>
        <td>
            <?php echo $this->Html->link($word['Word']['wordContent'],
array('controller' => 'words', 'action' => 'view', $word['Word']['id'])); ?>
        </td>
        <td><?php echo $word['Word']['difficulty']; ?></td>
    </tr>
    <?php endforeach; ?>
    <?php unset($word); ?>
</table>